package ru.rrtyui.moneytracker.dto.transaction;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class TransactionImportDto {
    private LocalDate date;
    private String parentCategory;
    private String subCategory;
    private BigDecimal amount;
    private String comment;
}
