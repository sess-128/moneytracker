package ru.rrtyui.moneytracker.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.rrtyui.moneytracker.dto.ImportRequest;
import ru.rrtyui.moneytracker.dto.transaction.TransactionImportDto;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.model.Transaction;
import ru.rrtyui.moneytracker.repository.CategoryRepository;
import ru.rrtyui.moneytracker.repository.TransactionRepository;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelImportService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    public ImportResult importTransactions(ImportRequest importRequest) throws IOException {
        List<TransactionImportDto> transactionToImport = parseExcel(importRequest.getFile(), importRequest.getSheetIndex(), importRequest.getSheetName());
        return saveTransactions(transactionToImport);
    }

    public List<String> getSheetNames(MultipartFile file) throws IOException {
        List<String> sheetNames = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                sheetNames.add(workbook.getSheetName(i));
            }
        }
        return sheetNames;
        }

    private List<TransactionImportDto> parseExcel(MultipartFile file, Integer sheetIndex, String sheetName) throws IOException {
        List<TransactionImportDto> result = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = getSheet(workbook, sheetIndex,sheetName);

            if (sheet == null) {
                throw new IllegalArgumentException("Лист не найден. Доступные листы: " + getSheetNames(file));
            }

            log.info("Импортируем лист: {}", sheet.getSheetName());

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                if (row.getCell(0) == null || row.getCell(0).getCellType() == CellType.BLANK) continue;

                TransactionImportDto importDto = TransactionImportDto.builder()
                        .date(parseDate(row.getCell(0)))
                        .parentCategory(getCellString(row.getCell(1)))
                        .subCategory(getCellString(row.getCell(2)))
                        .amount(parseAmount(row.getCell(3)))
                        .comment(getCellString(row.getCell(4)))
                        .build();

                result.add(importDto);
            }
        }

        log.info("Распаршено {} транзакций", result.size());
        return result;
    }

    private Sheet getSheet(Workbook workbook, Integer sheetIndex, String sheetName) {
        if (sheetName != null && !sheetName.isEmpty()) {
            return workbook.getSheet(sheetName);
        }
        if (sheetIndex != null && sheetIndex >= 0) {
            return workbook.getSheetAt(sheetIndex);
        }

        return workbook.getSheetAt(0);
    }

    private LocalDate parseDate(Cell cell) {
        if (cell == null) return null;

        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        }

        if (cell.getCellType() == CellType.STRING) {
            String dateStr = cell.getStringCellValue().trim();
            return LocalDate.parse(dateStr, DATE_FORMATTER);
        }

        return null;
    }

    private BigDecimal parseAmount(Cell cell) {
        if (cell == null) return BigDecimal.ZERO;

        if (cell.getCellType() == CellType.NUMERIC) {
            return BigDecimal.valueOf(cell.getNumericCellValue());
        }

        if (cell.getCellType() == CellType.STRING) {
            String amountStr = cell.getStringCellValue().trim()
                    .replace(",", ".")
                    .replace(" ", "");
            return new BigDecimal(amountStr);
        }

        return BigDecimal.ZERO;
    }

    private String getCellString(Cell cell) {
        if (cell == null) return null;

        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue().trim();
        }

        if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf(cell.getNumericCellValue());
        }

        return null;
    }

    private ImportResult saveTransactions(List<TransactionImportDto> importDtos) {
        Map<String, Category> categoriesByName  = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(
                        Category::getName,
                        category -> category, (a, b) -> a
                ));

        int successCount = 0;
        int errorCount = 0;
        List<String> errors = new ArrayList<>();

        for (TransactionImportDto importDto : importDtos) {
            try {


                Category category = categoriesByName.get(importDto.getSubCategory());

                if (category == null) {
                    errors.add("Категория не найдена: " + importDto.getSubCategory() + " (родитель: " + importDto.getParentCategory() + ")");
                    errorCount++;
                    continue;
                }

                Transaction transaction = new Transaction();
                transaction.setDate(importDto.getDate().atStartOfDay());
                transaction.setAmount(importDto.getAmount());
                transaction.setCategory(category);
                transaction.setDescription(importDto.getComment() != null ? importDto.getComment() : "");

                transactionRepository.save(transaction);
                successCount++;
            } catch (Exception e) {
                errors.add("Ошибка при импорте: " + importDto + " - " + e.getMessage());
                errorCount++;
                log.error("Error importing transaction: {}", importDto, e);
            }
        }
        log.info("Импорт завершён: success={}, errors={}", successCount, errorCount);
        return new ImportResult(successCount, errorCount, errors);
    }


    public record ImportResult(int successCount, int errorCount, List<String> errors) {}
}
