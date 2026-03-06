package ru.rrtyui.moneytracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.rrtyui.moneytracker.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

//    List<Category> findByParentIsNull();
//    List<Category> findByParentId();
//    List<Category> findByType();
}
