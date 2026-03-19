package ru.rrtyui.moneytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CategoryItemDto {
    private Long id;
    private String name;
    private Long parentId;
    private boolean hasChildren;
    private String type;
}