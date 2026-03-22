package ru.rrtyui.moneytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class DailySpendingDto {
    private LocalDate date;
    private BigDecimal amount;
    private BigDecimal cumulativeAmount;
}
