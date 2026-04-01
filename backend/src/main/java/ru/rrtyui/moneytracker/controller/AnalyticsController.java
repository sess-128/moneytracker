package ru.rrtyui.moneytracker.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.rrtyui.moneytracker.dto.DailySpendingDto;
import ru.rrtyui.moneytracker.dto.PeriodComparisonDto;
import ru.rrtyui.moneytracker.dto.SpendingStatsDto;
import ru.rrtyui.moneytracker.service.AnalyticsService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Статистика расходов за период
     */
    @GetMapping("/stats")
    public ResponseEntity<SpendingStatsDto> getStats(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        SpendingStatsDto stats = analyticsService.getSpendingStats(startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    /**
     * Сравнение периодов (текущий vs предыдущий)
     */
    @GetMapping("/compare")
    public ResponseEntity<PeriodComparisonDto> comparePeriods(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        PeriodComparisonDto comparison = analyticsService.comparePeriods(startDate, endDate);
        return ResponseEntity.ok(comparison);
    }

    /**
     * Накопительные расходы по дням
     */
    @GetMapping("/cumulative")
    public ResponseEntity<List<DailySpendingDto>> getCumulativeSpending(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<DailySpendingDto> data = analyticsService.getCumulativeSpending(startDate, endDate);
        return ResponseEntity.ok(data);
    }

    /**
     * Расходы по категориям
     */
    @GetMapping("/by-category")
    public ResponseEntity<Map<String, Double>> getSpendingByCategory(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Map<String, Double> data = analyticsService.getSpendingByCategory(startDate, endDate)
            .entrySet().stream()
            .collect(java.util.stream.Collectors.toMap(
                Map.Entry::getKey,
                e -> e.getValue().doubleValue()
            ));
        return ResponseEntity.ok(data);
    }
}
