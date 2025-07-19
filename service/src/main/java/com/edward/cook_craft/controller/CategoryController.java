package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.CategoryRequest;
import com.edward.cook_craft.dto.response.ApiResponse;
import com.edward.cook_craft.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Category", description = "Category management API")
public class CategoryController {

    private final CategoryService service;

    @GetMapping
    @Operation(summary = "Get all categories", description = "Retrieve a list of all categories")
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(ApiResponse.success(service.getAll()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
        }
    }

    @PostMapping
    @Operation(summary = "Create a new category", description = "Create a new category with the provided details")
    public ResponseEntity<?> create(
            @RequestBody CategoryRequest request
    ) {
       try {
           return ResponseEntity.ok(ApiResponse.success(service.create(request)));
       } catch (Exception e) {
           return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
       }
    }
}
