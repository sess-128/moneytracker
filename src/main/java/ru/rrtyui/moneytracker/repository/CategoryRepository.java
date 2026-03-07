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
    boolean existsByParentId(Long parentId);
    List<Category> findByType(CategoryType type);

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
            "GROUP BY c.id, c.name, c.parent.id")
    List<CategoryItemDto> findRootCategoryItems();
}
