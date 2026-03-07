package ru.rrtyui.moneytracker.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.rrtyui.moneytracker.dto.CategoryResponse;
import ru.rrtyui.moneytracker.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getRootCategories() {
        List<CategoryResponse> categories = categoryService.getRootCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}/children")
    public ResponseEntity<List<CategoryResponse>> getChildCategories(@PathVariable Long id) {
        List<CategoryResponse> categories = categoryService.getChildCategories(id);
        return ResponseEntity.ok(categories);
    }
}
