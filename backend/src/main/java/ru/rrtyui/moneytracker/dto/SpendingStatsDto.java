package ru.rrtyui.moneytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class SpendingStatsDto {
    private BigDecimal totalExpense;
    private BigDecimal totalIncome;
    private BigDecimal balance;
    private long transactionCount;
    private BigDecimal averageDailyExpense;
}
