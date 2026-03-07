package ru.rrtyui.moneytracker.mapper;

import lombok.experimental.UtilityClass;
import ru.rrtyui.moneytracker.dto.CategoryItemDto;
import ru.rrtyui.moneytracker.dto.CategoryResponse;
import ru.rrtyui.moneytracker.model.Category;

@UtilityClass
public class CategoryMapper {

    public static CategoryResponse toCategoryResponse(Category category) {
        return toCategoryResponse(category, false);
    }

    public static CategoryResponse toCategoryResponse(Category category, boolean hasChildren) {
        if (category == null) {
            return null;
        }
        Long parentId = (category.getParent() != null) ? category.getParent().getId() : null;
        return new CategoryResponse(
                category.getId(),
                parentId,
                category.getName(),
                hasChildren
        );
    }

    public static CategoryResponse toCategoryResponse(CategoryItemDto dto) {
        if (dto == null) {
            return null;
        }

        return new CategoryResponse(
                dto.getId(),
                dto.getParentId(),
                dto.getName(),
                dto.isHasChildren()
        );
    }
}
