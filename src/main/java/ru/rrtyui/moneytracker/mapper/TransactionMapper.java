package ru.rrtyui.moneytracker.mapper;

import lombok.experimental.UtilityClass;
import ru.rrtyui.moneytracker.dto.TransactionRequest;
import ru.rrtyui.moneytracker.dto.TransactionResponse;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.model.Transaction;

import java.time.LocalDateTime;

@UtilityClass
public class TransactionMapper {

    public static TransactionResponse toTransactionResponse(Transaction transaction) {
        Long categoryId = (transaction.getCategory() != null) ? transaction.getCategory().getId() : null;
        String categoryName = (transaction.getCategory() != null) ? transaction.getCategory().getName() : null;

        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getDescription(),
                categoryId,
                categoryName
        );
    }

    public static Transaction toTransaction(TransactionRequest request, Category category) {
        if (request == null) {
            return null;
        }

        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate() != null ? request.getDate() : LocalDateTime.now());
        transaction.setDescription(request.getDescription());
        transaction.setCategory(category); // Категория передается извне, так как её нужно достать из БД

        return transaction;
    }
}
