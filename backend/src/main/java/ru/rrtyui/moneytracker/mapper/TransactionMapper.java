package ru.rrtyui.moneytracker.mapper;

import lombok.experimental.UtilityClass;
import ru.rrtyui.moneytracker.dto.TransactionRequest;
import ru.rrtyui.moneytracker.dto.TransactionResponse;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.model.Transaction;

import java.time.LocalDateTime;

@UtilityClass
public class TransactionMapper {

    public static Transaction toTransaction(TransactionRequest request, Category category) {
        if (request == null || category == null) {
            return null;
        }

        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate() != null
                ? request.getDate().atStartOfDay()
                : LocalDateTime.now());
        transaction.setDescription(request.getDescription());
        transaction.setCategory(category);

        return transaction;
    }

    public static TransactionResponse toTransactionResponse(Transaction transaction) {
        if (transaction == null) {
            return null;
        }

        Category category = transaction.getCategory();
        Long categoryId = (category != null) ? category.getId() : null;
        String categoryName = (category != null) ? category.getName() : null;

        String type = (category != null && category.getType() != null)
                ? category.getType().name()
                : "EXPENSE";

        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getDescription(),
                categoryId,
                categoryName,
                type
        );
    }
}