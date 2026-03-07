package ru.rrtyui.moneytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import ru.rrtyui.moneytracker.model.CategoryType;

@Getter
@Setter
@AllArgsConstructor
public class UpdateCategoryRequest {
    private String name;
    private CategoryType type;
    private Long parentId;
}
