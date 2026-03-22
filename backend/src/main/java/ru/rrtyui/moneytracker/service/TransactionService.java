package ru.rrtyui.moneytracker.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rrtyui.moneytracker.dto.TransactionFilterRequest;
import ru.rrtyui.moneytracker.dto.TransactionRequest;
import ru.rrtyui.moneytracker.dto.TransactionResponse;
import ru.rrtyui.moneytracker.exception.TransactionException;
import ru.rrtyui.moneytracker.mapper.TransactionMapper;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.model.Transaction;
import ru.rrtyui.moneytracker.repository.CategoryRepository;
import ru.rrtyui.moneytracker.repository.TransactionRepository;
import ru.rrtyui.moneytracker.repository.specification.TransactionSpecifications;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public TransactionResponse createTransaction(TransactionRequest request) {

        Long categoryId = request.getCategoryId();
        log.info("Finding category with ID {}", categoryId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> {
                    log.warn("Category with ID {} not found", categoryId);
                    return new TransactionException("Категория с ID %d не найдена".formatted(categoryId));
                });

        Transaction transaction = TransactionMapper.toTransaction(request, category);
        transaction.setCategory(category);

        log.info("Saving transaction with ID {}", transaction.getId());
        Transaction saved = transactionRepository.save(transaction);
        log.info("Saved transaction with ID {}", transaction.getId());

        return TransactionMapper.toTransactionResponse(saved);
    }

    public List<TransactionResponse> getAllTransactions(LocalDateTime from, LocalDateTime to, Long categoryId) {

        List<Specification<Transaction>> specs = new ArrayList<>();
        log.info("Search transactions from {} to {} with categoryId {}", from, to, categoryId);

        if (categoryId != null) {
            specs.add(TransactionSpecifications.hasCategoryId(categoryId));
        }
        if (from != null) {
            specs.add(TransactionSpecifications.dateAfter(from));
        }
        if (to != null) {
            specs.add(TransactionSpecifications.dateBefore(to));
        }

        Specification<Transaction> specification = Specification.allOf(specs);

        return transactionRepository.findAll(specification).stream()
                .map(TransactionMapper::toTransactionResponse)
                .collect(Collectors.toList());
    }

    public Page<TransactionResponse> getFilteredTransactions(TransactionFilterRequest filter, int page, int size) {
        log.info("Filtering transactions with params: {}", filter);

        Specification<Transaction> spec = Specification
                .where(TransactionSpecifications.dateBetween(filter.getStartDate(), filter.getEndDate()))
                .and(TransactionSpecifications.hasParentCategories(filter.getParentCategoryIds()))
                .and(TransactionSpecifications.hasCategories(filter.getCategoryIds()))
                .and(TransactionSpecifications.amountBetween(filter.getMinAmount(), filter.getMaxAmount()))
                .and(TransactionSpecifications.descriptionContains(filter.getDescription()))
                .and(TransactionSpecifications.hasType(filter.getType()));

        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("date").descending());

        Page<Transaction> pageResult = transactionRepository.findAll(spec, pageable);

        return pageResult.map(TransactionMapper::toTransactionResponse);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        log.info("Delete transaction with ID {}", id);
        transactionRepository.deleteById(id);
    }
}
