package ru.rrtyui.moneytracker.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class TransactionRequest { //TODO: почему айди категории?
    private BigDecimal amount;
    private LocalDate date;
    private String description;
    private Long categoryId;
}
