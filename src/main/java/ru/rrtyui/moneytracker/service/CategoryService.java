package ru.rrtyui.moneytracker.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.rrtyui.moneytracker.dto.CategoryItemDto;
import ru.rrtyui.moneytracker.dto.CategoryResponse;
import ru.rrtyui.moneytracker.mapper.CategoryMapper;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.repository.CategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getRootCategories() {
        return categoryRepository.findRootCategoryItems().stream()
                .map(CategoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getChildCategories(Long parentId) {
        List<CategoryItemDto> dtos = categoryRepository.findCategoryItemsByParentId(parentId);

        return dtos.stream()
                .map(CategoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Категория с ID " + id + " не найдена"));
    }
}
