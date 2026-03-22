package ru.rrtyui.moneytracker.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rrtyui.moneytracker.dto.CategoryItemDto;
import ru.rrtyui.moneytracker.dto.CategoryResponse;
import ru.rrtyui.moneytracker.dto.CreateCategoryRequest;
import ru.rrtyui.moneytracker.dto.UpdateCategoryRequest;
import ru.rrtyui.moneytracker.exception.CategoryInUseException;
import ru.rrtyui.moneytracker.exception.CategoryNotFoundException;
import ru.rrtyui.moneytracker.exception.CategoryValidationException;
import ru.rrtyui.moneytracker.mapper.CategoryMapper;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.repository.CategoryRepository;
import ru.rrtyui.moneytracker.repository.TransactionRepository;
import ru.rrtyui.moneytracker.util.CategoryValidator;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryValidator categoryValidator;

    public List<CategoryResponse> getRootCategories() {
        log.info("Получаем все рутовые категории");
        return categoryRepository.findRootCategoryItems().stream()
                .map(CategoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getChildCategories(Long parentId) {
        log.info("Получаем дочерние категории, у которых родитель с ID = {}", parentId);
        List<CategoryItemDto> itemsByParentId = categoryRepository.findCategoryItemsByParentId(parentId);

        return itemsByParentId.stream()
                .map(CategoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getAllLeafCategories() {
        log.info("Получаем все дочерние категории");
        return categoryRepository.findAllLeafCategoryItems().stream()
                .map(CategoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    public Category getCategoryById(Long id) {
        log.info("Получаем категорию, у которой ID = {}", id);
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryValidationException("Категория с ID " + id + " не найдена"));
    }

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        log.info("Запрос на создание категории: {}", request);
        categoryValidator.validateUniqueness(request.getName(), request.getParentId(), null);

        Category parent = fetchParentIfExists(request.getParentId());

        Category category = new Category(request.getName(), parent, request.getType());
        Category saved = categoryRepository.save(category);

        return CategoryMapper.toCategoryResponse(saved, false);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        log.info("Обновление категории с ID = {}, {}", id, request);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        Long currentParentId = (category.getParent() != null) ? category.getParent().getId() : null;
        boolean nameChanged = !Objects.equals(category.getName(), request.getName());
        boolean parentChanged = !Objects.equals(currentParentId, request.getParentId());

        if (nameChanged || parentChanged) {
            categoryValidator.validateUniqueness(request.getName(), request.getParentId(), id);
        }

        if (parentChanged) {
            categoryValidator.validateParentChange(category, request.getParentId());
            category.setParent(fetchParentIfExists(request.getParentId()));
        }

        category.setName(request.getName());
        category.setType(request.getType());

        Category updated = categoryRepository.save(category);
        boolean hasChildren = categoryRepository.existsByParentId(updated.getId());

        return CategoryMapper.toCategoryResponse(updated, hasChildren);
    }

    @Transactional
    public void deleteCategory(Long id) {
        log.info("Удаляем категорию с ID = {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        if (categoryRepository.existsByParentId(id)) {
            throw new CategoryValidationException("Невозможно удалить категорию: сначала удалите все подкатегории");
        }

        long count = transactionRepository.countByCategoryId(id);
        if (count > 0) {
            throw new CategoryInUseException(
                    String.format("Невозможно удалить категорию: к ней привязано %d транзакций.", count)
            );
        }

        categoryRepository.delete(category);
    }

    private Category fetchParentIfExists(Long parentId) {
        if (parentId == null) return null;
        return categoryRepository.findById(parentId)
                .orElseThrow(() -> new CategoryNotFoundException(parentId));
    }

    public List<CategoryResponse> getAllCategories() {
        log.info("Получаем ВСЕ категории (плоский список)");

        List<CategoryItemDto> dtos = categoryRepository.findAllWithHasChildren();

        return dtos.stream()
                .map(CategoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }
}
