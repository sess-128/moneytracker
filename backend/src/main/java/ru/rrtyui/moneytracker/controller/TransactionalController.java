package ru.rrtyui.moneytracker.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.rrtyui.moneytracker.dto.transaction.TransactionFilterRequest;
import ru.rrtyui.moneytracker.dto.transaction.TransactionRequest;
import ru.rrtyui.moneytracker.dto.transaction.TransactionResponse;
import ru.rrtyui.moneytracker.model.CategoryType;
import ru.rrtyui.moneytracker.service.TransactionService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("transactions")
@RequiredArgsConstructor
public class TransactionalController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@RequestBody TransactionRequest request) {
        TransactionResponse created = transactionService.createTransaction(request);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<TransactionResponse>> getFiltered(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                 @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                                 @RequestParam(required = false) List<Long> parentCategoryIds,
                                                                 @RequestParam(required = false) List<Long> categoryIds,
                                                                 @RequestParam(required = false) BigDecimal minAmount,
                                                                 @RequestParam(required = false) BigDecimal maxAmount,
                                                                 @RequestParam(required = false) String description,
                                                                 @RequestParam(required = false) CategoryType type,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "40") int size) {
        TransactionFilterRequest filter = new TransactionFilterRequest();
        filter.setStartDate(startDate);
        filter.setEndDate(endDate);
        filter.setParentCategoryIds(parentCategoryIds);
        filter.setCategoryIds(categoryIds);
        filter.setMinAmount(minAmount);
        filter.setMaxAmount(maxAmount);
        filter.setDescription(description);
        filter.setType(type);

        Page<TransactionResponse> result = transactionService.getFilteredTransactions(filter, page, size);
        return ResponseEntity.ok(result);
    }
}
