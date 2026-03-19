package ru.rrtyui.moneytracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.rrtyui.moneytracker.dto.CategoryItemDto;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.model.CategoryType;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // ✅ ИСПОЛЬЗУЕМ FETCH JOIN, чтобы забрать родителей сразу и избежать N+1
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.parent WHERE c.parent IS NULL")
    List<Category> findByParentIsNull();

    List<Category> findByType(CategoryType type);

    boolean existsByParentId(Long parentId);

    // ✅ Этот метод ок, он делает агрегацию в базе, N+1 тут нет.
    // Но если потом в коде ты делаешь category.getParent(), то снова будет N+1.
    // Поэтому лучше использовать методы, возвращающие Entity с FETCH JOIN, а DTO строить вручную.
    // Оставляем как есть, если ты используешь только данные из DTO.
    @Query("SELECT new ru.rrtyui.moneytracker.dto.CategoryItemDto(" +
            "c.id, c.name, null, " +
            "CASE WHEN COUNT(c2) > 0 THEN true ELSE false END, " +
            "cast(c.type as string)) "+ // Берем реальный тип
            "FROM Category c " +
            "LEFT JOIN Category c2 ON c2.parent = c " +
            "WHERE c.parent IS NULL " +
            "GROUP BY c.id, c.name, c.type") // Добавили c.type в группировку
    List<CategoryItemDto> findRootCategoryItems();

    @Query("SELECT new ru.rrtyui.moneytracker.dto.CategoryItemDto(" +
            "c.id, c.name, c.parent.id, " +
            "CASE WHEN COUNT(c2) > 0 THEN true ELSE false END, " +
            "cast(c.type as string)) " +
            "FROM Category c " +
            "LEFT JOIN Category c2 ON c2.parent = c " +
            "WHERE c.parent.id = :parentId " +
            "GROUP BY c.id, c.name, c.parent.id, c.type")
    List<CategoryItemDto> findCategoryItemsByParentId(@Param("parentId") Long parentId);

    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE c.name = :name " +
            "AND ((c.parent.id = :parentId) OR (c.parent IS NULL AND :parentId IS NULL)) " +
            "AND c.id <> :excludeId")
    boolean existsByNameAndParentId(@Param("name") String name,
                                    @Param("parentId") Long parentId,
                                    @Param("excludeId") Long excludeId);

    @Query(value = """
        WITH RECURSIVE category_tree AS (
            SELECT id, parent_id FROM categories WHERE id = :candidateChildId
            UNION ALL
            SELECT c.id, c.parent_id FROM categories c
            INNER JOIN category_tree ct ON c.id = ct.parent_id
        )
        SELECT COUNT(*) FROM category_tree WHERE id = :potentialParentId
        """, nativeQuery = true)
    long countCyclePath(@Param("potentialParentId") Long potentialParentId,
                        @Param("candidateChildId") Long candidateChildId);

    @Query("SELECT c FROM Category c WHERE NOT EXISTS (SELECT 1 FROM Category child WHERE child.parent = c)")
    List<Category> findAllLeafCategories();

    // ✅ ГЛАВНОЕ ИСПРАВЛЕНИЕ ДЛЯ ПОИСКА:
    // Добавляем LEFT JOIN FETCH c.parent, чтобы при итерации по списку не было N+1
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.parent ORDER BY c.type, c.name")
    List<Category> findAllSorted();

    @Query("SELECT new ru.rrtyui.moneytracker.dto.CategoryItemDto(" +
            "c.id, c.name, c.parent.id, " +
            "CASE WHEN COUNT(c2) > 0 THEN true ELSE false END, " +
            "cast(c.type as string)) "+
            "FROM Category c " +
            "LEFT JOIN Category c2 ON c2.parent = c " +
            "GROUP BY c.id, c.name, c.parent.id, c.type")
    List<CategoryItemDto> findAllWithHasChildren();
}