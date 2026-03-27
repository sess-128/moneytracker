package ru.rrtyui.moneytracker.dto.transaction;

import lombok.Getter;
import lombok.Setter;
import ru.rrtyui.moneytracker.model.CategoryType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class TransactionFilterRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private List<Long> parentCategoryIds;
    private List<Long> categoryIds;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private String description;
    private CategoryType type;
}
