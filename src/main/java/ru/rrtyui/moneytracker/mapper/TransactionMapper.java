package ru.rrtyui.moneytracker.mapper;

import lombok.experimental.UtilityClass;
import ru.rrtyui.moneytracker.dto.TransactionRequest;
import ru.rrtyui.moneytracker.dto.TransactionResponse;
import ru.rrtyui.moneytracker.model.Transaction;

import java.time.LocalDateTime;

@UtilityClass
public class TransactionMapper {

    public static TransactionResponse toTransactionResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getDescription(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName()
        );
    }

    public static Transaction toTransaction(TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate() != null ? request.getDate() : LocalDateTime.now());
        transaction.setDescription(request.getDescription());

        return transaction;
    }
}
