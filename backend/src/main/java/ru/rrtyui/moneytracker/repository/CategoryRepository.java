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

    List<Category> findByParentIsNull();
    List<Category> findByType(CategoryType type);
    boolean existsByParentId(Long parentId);

    @Query("SELECT new ru.rrtyui.moneytracker.dto.CategoryItemDto(" +
            "c.id, c.name, c.parent.id, " +
            "CASE WHEN COUNT(c2) > 0 THEN true ELSE false END) " +
            "FROM Category c " +
            "LEFT JOIN Category c2 ON c2.parent = c " +
            "WHERE c.parent.id = :parentId " +
            "GROUP BY c.id, c.name, c.parent.id")
    List<CategoryItemDto> findCategoryItemsByParentId(@Param("parentId") Long parentId);

    @Query("SELECT new ru.rrtyui.moneytracker.dto.CategoryItemDto(" +
            "c.id, c.name, c.parent.id, " +
            "CASE WHEN COUNT(c2) > 0 THEN true ELSE false END) " +
            "FROM Category c " +
            "LEFT JOIN Category c2 ON c2.parent = c " +
            "WHERE c.parent IS NULL " +
            "GROUP BY c.id, c.name")
    List<CategoryItemDto> findRootCategoryItems();

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
}
