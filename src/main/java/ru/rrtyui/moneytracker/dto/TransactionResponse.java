package ru.rrtyui.moneytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import ru.rrtyui.moneytracker.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TransactionResponse {

    private Long id;
    private BigDecimal amount;
    private LocalDateTime date;
    private String description;
    private Long categoryId;
    private String categoryName;

    //TODO сделать нормальный маппер
    public static TransactionResponse fromEntity(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getDescription(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName()
        );
    }
}
