package ru.rrtyui.moneytracker.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rrtyui.moneytracker.dto.DailySpendingDto;
import ru.rrtyui.moneytracker.dto.PeriodComparisonDto;
import ru.rrtyui.moneytracker.dto.SpendingStatsDto;
import ru.rrtyui.moneytracker.model.CategoryType;
import ru.rrtyui.moneytracker.repository.TransactionRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final TransactionRepository transactionRepository;

    /**
     * Получение статистики расходов за период
     */
    public SpendingStatsDto getSpendingStats(LocalDate startDate, LocalDate endDate) {
        // Используем очень старые/далёкие даты вместо null для корректной работы SQL
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.of(1970, 1, 1, 0, 0);
        LocalDateTime end = endDate != null ? endDate.atTime(23, 59, 59) : LocalDateTime.of(2099, 12, 31, 23, 59, 59);

        List<TransactionForStats> transactions = transactionRepository.findAllForStats(start, end);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (TransactionForStats tx : transactions) {
            if (tx.getType() == CategoryType.INCOME) {
                totalIncome = totalIncome.add(tx.getAmount());
            } else {
                totalExpense = totalExpense.add(tx.getAmount());
            }
        }

        long days = ChronoUnit.DAYS.between(start, end) + 1;
        BigDecimal averageDailyExpense = days > 0 
            ? totalExpense.divide(BigDecimal.valueOf(days), 2, java.math.RoundingMode.HALF_UP) 
            : BigDecimal.ZERO;

        return new SpendingStatsDto(
            totalExpense,
            totalIncome,
            totalIncome.subtract(totalExpense),
            transactions.size(),
            averageDailyExpense
        );
    }

    /**
     * Сравнение периодов (текущий vs предыдущий)
     */
    public PeriodComparisonDto comparePeriods(LocalDate startDate, LocalDate endDate) {
        // Получаем статистику текущего периода
        SpendingStatsDto current = getSpendingStats(startDate, endDate);

        // Вычисляем предыдущий период (такой же длительности)
        long daysDiff = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        LocalDate prevEnd = startDate.minusDays(1);
        LocalDate prevStart = prevEnd.minusDays(daysDiff - 1);

        SpendingStatsDto previous = getSpendingStats(prevStart, prevEnd);

        // Считаем проценты изменений
        BigDecimal expenseChange = calculateChangePercent(previous.getTotalExpense(), current.getTotalExpense());
        BigDecimal incomeChange = calculateChangePercent(previous.getTotalIncome(), current.getTotalIncome());
        BigDecimal balanceChange = calculateChangePercent(previous.getBalance(), current.getBalance());

        return new PeriodComparisonDto(
            current,
            previous,
            expenseChange,
            incomeChange,
            balanceChange
        );
    }

    private BigDecimal calculateChangePercent(BigDecimal previous, BigDecimal current) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? BigDecimal.valueOf(100) : BigDecimal.ZERO;
        }
        return current.subtract(previous)
            .multiply(BigDecimal.valueOf(100))
            .divide(previous, 2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Получение накопительных расходов по дням
     */
    public List<DailySpendingDto> getCumulativeSpending(LocalDate startDate, LocalDate endDate) {
        // Используем дефолтные даты вместо null
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.of(1970, 1, 1, 0, 0);
        LocalDateTime end = endDate != null ? endDate.atTime(23, 59, 59) : LocalDateTime.of(2099, 12, 31, 23, 59, 59);

        List<TransactionForStats> transactions = transactionRepository.findAllForStats(start, end);

        // Фильтруем только расходы
        List<TransactionForStats> expenses = transactions.stream()
            .filter(tx -> tx.getType() == CategoryType.EXPENSE)
            .toList();

        // Группируем по датам
        java.util.Map<LocalDate, BigDecimal> byDate = new java.util.HashMap<>();
        for (TransactionForStats tx : expenses) {
            LocalDate date = tx.getDate().toLocalDate();
            byDate.merge(date, tx.getAmount(), BigDecimal::add);
        }

        // Создаём полный диапазон дат
        List<LocalDate> allDates = new ArrayList<>();
        LocalDate current = startDate != null ? startDate : LocalDate.of(1970, 1, 1);
        LocalDate endLocal = endDate != null ? endDate : LocalDate.of(2099, 12, 31);
        
        // Ограничиваем диапазон 365 днями для производительности
        long daysBetween = ChronoUnit.DAYS.between(current, endLocal);
        if (daysBetween > 365) {
            endLocal = current.plusDays(365);
        }
        
        while (!current.isAfter(endLocal)) {
            allDates.add(current);
            current = current.plusDays(1);
        }

        // Строим накопительный график
        List<DailySpendingDto> result = new ArrayList<>();
        BigDecimal cumulative = BigDecimal.ZERO;

        for (LocalDate date : allDates) {
            BigDecimal dailyAmount = byDate.getOrDefault(date, BigDecimal.ZERO);
            cumulative = cumulative.add(dailyAmount);
            result.add(new DailySpendingDto(date, dailyAmount, cumulative));
        }

        return result;
    }

    /**
     * Расходы по категориям за период
     */
    public java.util.Map<String, BigDecimal> getSpendingByCategory(LocalDate startDate, LocalDate endDate) {
        // Используем дефолтные даты вместо null
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.of(1970, 1, 1, 0, 0);
        LocalDateTime end = endDate != null ? endDate.atTime(23, 59, 59) : LocalDateTime.of(2099, 12, 31, 23, 59, 59);

        List<TransactionForStats> transactions = transactionRepository.findAllForStats(start, end);

        java.util.Map<String, BigDecimal> byCategory = new java.util.HashMap<>();
        for (TransactionForStats tx : transactions) {
            if (tx.getType() == CategoryType.EXPENSE) {
                String categoryName = tx.getCategoryName() != null ? tx.getCategoryName() : "Без категории";
                byCategory.merge(categoryName, tx.getAmount(), BigDecimal::add);
            }
        }

        return byCategory;
    }

    // Внутренний класс для проекции
    public interface TransactionForStats {
        Long getId();
        BigDecimal getAmount();
        LocalDateTime getDate();
        CategoryType getType();
        String getCategoryName();
    }
}
