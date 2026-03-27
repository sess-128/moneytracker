package ru.rrtyui.moneytracker.mapper;

import lombok.experimental.UtilityClass;
import ru.rrtyui.moneytracker.dto.category.CategoryItemDto;
import ru.rrtyui.moneytracker.dto.category.CategoryResponse;
import ru.rrtyui.moneytracker.model.Category;

@UtilityClass
public class CategoryMapper {

    public static CategoryResponse toCategoryResponse(Category category, boolean hasChildren) {
        if (category == null) {
            return null;
        }
        Long parentId = (category.getParent() != null) ? category.getParent().getId() : null;

        String type = category.getType() != null ? category.getType().name() : "EXPENSE";

        return new CategoryResponse(
                category.getId(),
                parentId,
                category.getName(),
                hasChildren,
                type
        );
    }

    public static CategoryResponse toCategoryResponse(CategoryItemDto dto) {
        if (dto == null) {
            return null;
        }

        String type = dto.getType() != null ? dto.getType() : "EXPENSE";

        return new CategoryResponse(
                dto.getId(),
                dto.getParentId(),
                dto.getName(),
                dto.isHasChildren(),
                type
        );
    }
}