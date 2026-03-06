package ru.rrtyui.moneytracker.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionRequest {

    private BigDecimal amount;
    private LocalDateTime date;
    private String description;
    private Long categoryId;

}
