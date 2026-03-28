package ru.rrtyui.moneytracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.rrtyui.moneytracker.dto.category.CategoryItemDto;
import ru.rrtyui.moneytracker.model.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByParentId(Long parentId);

    @Query("SELECT new ru.rrtyui.moneytracker.dto.category.CategoryItemDto(" +
            "c.id, c.name, null, " +
            "CASE WHEN COUNT(c2) > 0 THEN true ELSE false END, " +
            "cast(c.type as string)) " + // Берем реальный тип
            "FROM Category c " +
            "LEFT JOIN Category c2 ON c2.parent = c " +
            "WHERE c.parent IS NULL " +
            "GROUP BY c.id, c.name, c.type")
    List<CategoryItemDto> findRootCategoryItems();

    @Query("SELECT new ru.rrtyui.moneytracker.dto.category.CategoryItemDto(" +
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

    @Query("SELECT new ru.rrtyui.moneytracker.dto.category.CategoryItemDto(" +
            "c.id, c.name, c.parent.id, " +
            "false, " +  // у листьев нет детей
            "cast(c.type as string)) " +
            "FROM Category c " +
            "WHERE NOT EXISTS (SELECT 1 FROM Category child WHERE child.parent = c)")
    List<CategoryItemDto> findAllLeafCategoryItems();

    @Query("SELECT new ru.rrtyui.moneytracker.dto.category.CategoryItemDto(" +
            "c.id, c.name, c.parent.id, " +
            "CASE WHEN COUNT(c2) > 0 THEN true ELSE false END, " +
            "cast(c.type as string)) " +
            "FROM Category c " +
            "LEFT JOIN Category c2 ON c2.parent = c " +
            "GROUP BY c.id, c.name, c.parent.id, c.type")
    List<CategoryItemDto> findAllWithHasChildren();
}