package ru.rrtyui.moneytracker.repository.specification;

import org.springframework.data.jpa.domain.Specification;
import ru.rrtyui.moneytracker.model.Transaction;

import java.time.LocalDateTime;

public class TransactionSpecifications {

    public static Specification<Transaction> hasCategoryId(Long categoryId) {
        return (root, query, cb) ->
                categoryId == null ? null : cb.equal(root.get("categoryId"), categoryId);
    }

    public static Specification<Transaction> dateAfter(LocalDateTime from) {
        return (root, query, cb) ->
                from == null ? null : cb.greaterThanOrEqualTo(root.get("date"), from);
    }

    public static Specification<Transaction> dateBefore(LocalDateTime to) {
        return (root, query, cb) ->
                to == null ? null : cb.lessThanOrEqualTo(root.get("date"), to);
    }
}
