package ru.rrtyui.moneytracker.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.rrtyui.moneytracker.model.Transaction;
import ru.rrtyui.moneytracker.service.AnalyticsService;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    long countByCategoryId(Long categoryId);

    @Override
    @EntityGraph(attributePaths = {"category", "category.parent"})
    Page<Transaction> findAll(Specification<Transaction> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"category", "category.parent"})
    List<Transaction> findAll(Specification<Transaction> spec);

    @Query("SELECT t.id as id, t.amount as amount, t.date as date, c.type as type, c.name as categoryName " +
            "FROM Transaction t JOIN t.category c " +
            "WHERE t.date >= :startDate AND t.date <= :endDate")
    List<AnalyticsService.TransactionForStats> findAllForStats(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.date >= :startDate AND t.date <= :endDate")
    long countByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
