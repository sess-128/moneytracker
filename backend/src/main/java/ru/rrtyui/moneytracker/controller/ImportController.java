package ru.rrtyui.moneytracker.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.rrtyui.moneytracker.dto.ImportRequest;
import ru.rrtyui.moneytracker.service.ExcelImportService;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/import")
public class ImportController {

    private final ExcelImportService excelImportService;

    @PostMapping("/excel")
    public ResponseEntity<?> importExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "sheetIndex", required = false) Integer sheetIndex,
            @RequestParam(value = "sheetName", required = false) String sheetName) {
        try {
            ImportRequest request = new ImportRequest(file, sheetIndex, sheetName);
            ExcelImportService.ImportResult result = excelImportService.importTransactions(request);

            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Ошибка чтения файла: " + e.getMessage());
        }
    }

    @GetMapping("/sheets")
    public ResponseEntity<?> getSheets(@RequestParam("file") MultipartFile file) {
        try {
            List<String> sheetNames = excelImportService.getSheetNames(file);
            return ResponseEntity.ok(sheetNames);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Ошибка чтения файла: " + e.getMessage());
        }
    }
}
