package ru.rrtyui.moneytracker.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.rrtyui.moneytracker.exception.CategoryValidationException;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.repository.CategoryRepository;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class CategoryValidator {

    private final CategoryRepository categoryRepository;

    /**
     * Проверяет уникальность имени категории внутри родительской группы.
     */
    public void validateUniqueness(String name, Long parentId, Long excludeId) {
        if (categoryRepository.existsByNameAndParentId(name, parentId, excludeId)) {
            throw new CategoryValidationException(
                    "Категория с именем '" + name + "' уже существует в выбранной группе"
            );
        }
    }

    /**
     * Проверяет корректность смены родителя.
     * 1. Нельзя сделать категорию родителем самой себя.
     * 2. Нельзя создать циклическую зависимость (сделать потомка родителем).
     */
    public void validateParentChange(Category category, Long newParentId) {
        // Если родитель не меняется или становится null (корневая категория) - проверка не нужна
        if (newParentId == null) {
            return;
        }

        // Проверка 1: Сам на себя
        if (Objects.equals(category.getId(), newParentId)) {
            throw new CategoryValidationException("Категория не может быть своим собственным родителем");
        }

        // Проверка 2: Цикл (является ли новый родитель потомком текущей категории)
        // Если мы идем вверх от category и встречаем newParentId -> цикл!
        if (hasCycle(newParentId, category.getId())) {
            throw new CategoryValidationException(
                    "Невозможно установить родителя: будет нарушена иерархия (циклическая зависимость)"
            );
        }
    }

    /**
     * Внутренний метод проверки цикла через рекурсивный запрос БД.
     * Возвращает true, если potentialParent является предком candidateChild.
     */
    private boolean hasCycle(Long potentialParentId, Long candidateChildId) {
        return categoryRepository.countCyclePath(potentialParentId, candidateChildId) > 0;
    }
}
