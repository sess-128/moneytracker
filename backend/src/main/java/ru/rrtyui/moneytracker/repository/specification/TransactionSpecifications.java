package ru.rrtyui.moneytracker.repository.specification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import ru.rrtyui.moneytracker.model.CategoryType;
import ru.rrtyui.moneytracker.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
public class TransactionSpecifications {

    public static Specification<Transaction> hasCategoryId(Long categoryId) {
        return (root, query, cb) ->
                categoryId == null ? null : cb.equal(root.join("category").get("id"), categoryId);
    }

    public static Specification<Transaction> dateAfter(LocalDateTime from) {
        return (root, query, cb) ->
                from == null ? null : cb.greaterThanOrEqualTo(root.get("date"), from);
    }

    public static Specification<Transaction> dateBefore(LocalDateTime to) {
        return (root, query, cb) ->
                to == null ? null : cb.lessThanOrEqualTo(root.get("date"), to);
    }

    public static Specification<Transaction> dateBetween(LocalDate start, LocalDate end) {
        return (root, query, cb) -> {
            if (start == null && end == null) return cb.conjunction();
            if (start != null && end != null) {
                return cb.between(root.get("date"), start.atStartOfDay(), end.atTime(23, 59, 59));
            }
            if (start != null) {
                return cb.greaterThanOrEqualTo(root.get("date"), start.atStartOfDay());
            }
            return cb.lessThanOrEqualTo(root.get("date"), end.atTime(23, 59, 59));
        };
    }

    public static Specification<Transaction> hasParentCategories(List<Long> parentIds) {
        return (root, query, cb) -> {
            if (parentIds == null || parentIds.isEmpty()) return cb.conjunction();
            var categoryJoin = root.join("category");
            return categoryJoin.get("parent").get("id").in(parentIds);
        };
    }

    public static Specification<Transaction> hasCategories(List<Long> categoryIds) {
        return (root, query, cb) -> {
            if (categoryIds == null || categoryIds.isEmpty()) {
                log.debug("No category filter applied");
                return cb.isTrue(cb.literal(true));
            }
            log.debug("Filtering by category IDs: {}", categoryIds);
            return root.get("category").get("id").in(categoryIds);
        };
    }

    public static Specification<Transaction> amountBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min != null && max != null) {
                return cb.between(root.get("amount"), min, max);
            }
            if (min != null) {
                return cb.greaterThanOrEqualTo(root.get("amount"), min);
            }
            return cb.lessThanOrEqualTo(root.get("amount"), max);
        };
    }

    public static Specification<Transaction> descriptionContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isEmpty()) return cb.conjunction();
            return cb.like(cb.lower(root.get("description")), "%" + keyword.toLowerCase() + "%");
        };
    }

    public static Specification<Transaction> hasType(CategoryType type) {
        return (root, query, cb) -> {
            if (type == null) return cb.conjunction();
            var categoryJoin = root.join("category");
            return cb.equal(categoryJoin.get("type"), type);
        };
    }
}
