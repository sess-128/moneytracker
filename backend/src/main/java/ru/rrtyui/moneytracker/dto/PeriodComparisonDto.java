package ru.rrtyui.moneytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class PeriodComparisonDto {
    private SpendingStatsDto currentPeriod;
    private SpendingStatsDto previousPeriod;
    private BigDecimal expenseChangePercent;
    private BigDecimal incomeChangePercent;
    private BigDecimal balanceChangePercent;
}
