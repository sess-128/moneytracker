package ru.rrtyui.moneytracker.dto.category;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private Long parentId;
    private String name;
    private boolean hasChildren;
    private String type;
}
