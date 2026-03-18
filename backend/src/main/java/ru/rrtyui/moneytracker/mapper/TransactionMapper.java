package ru.rrtyui.moneytracker.mapper;

import lombok.experimental.UtilityClass;
import ru.rrtyui.moneytracker.dto.TransactionRequest;
import ru.rrtyui.moneytracker.dto.TransactionResponse;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.model.Transaction;
import ru.rrtyui.moneytracker.model.TransactionType;

import java.time.LocalDateTime;

@UtilityClass
public class TransactionMapper {

    public static TransactionResponse toTransactionResponse(Transaction transaction) {
        Long categoryId = (transaction.getCategory() != null) ? transaction.getCategory().getId() : null;
        String categoryName = (transaction.getCategory() != null) ? transaction.getCategory().getName() : null;
        String typeStr = (transaction.getType() != null) ? transaction.getType().name() : null;

        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getDescription(),
                categoryId,
                categoryName,
                typeStr
        );
    }

    public static Transaction toTransaction(TransactionRequest request, Category category) {
        if (request == null) {
            return null;
        }

        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate() != null ? request.getDate().atStartOfDay() : LocalDateTime.now());
        transaction.setDescription(request.getDescription());
        transaction.setCategory(category);

        if (request.getType() != null) {
            transaction.setType(request.getType());
        } else {
            transaction.setType(TransactionType.EXPENSE);
        }

        return transaction;
    }
}
