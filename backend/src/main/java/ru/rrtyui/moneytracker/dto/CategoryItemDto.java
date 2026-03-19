package ru.rrtyui.moneytracker.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryItemDto {
    private Long id;
    private String name;
    private Long parentId;
    private boolean hasChildren;
    private String type;

    // ✅ ЕДИНСТВЕННЫЙ КОНСТРУКТОР для всех случаев
    public CategoryItemDto(Long id, String name, Long parentId, boolean hasChildren, String type) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.hasChildren = hasChildren;
        this.type = type;
    }

    // Пустой конструктор (для JPA/сериализации)
    public CategoryItemDto() {}
}