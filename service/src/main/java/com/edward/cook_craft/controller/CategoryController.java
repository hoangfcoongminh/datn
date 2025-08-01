package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.CategoryRequest;
import com.edward.cook_craft.service.CategoryService;
import com.edward.cook_craft.utils.ResponseUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
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
//        try {
        return ResponseUtils.handleSuccess(service.getAll());
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }

    @PostMapping("/filter")
    @Operation(summary = "Filter category", description = "Filter all category")
    public ResponseEntity<?> filter(
            @RequestBody CategoryRequest categoryRequest,
            Pageable pageable
    ) {
//        try {
        return ResponseUtils.handleSuccess(service.filter(categoryRequest, pageable));
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }

    @PostMapping
    @Operation(summary = "Create a new category", description = "Create a new category with the provided details")
    public ResponseEntity<?> create(
            @RequestBody @Valid CategoryRequest request
    ) {
//       try {
        return ResponseUtils.handleSuccess(service.create(request));
//       } catch (Exception e) {
//           return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//       }
    }

    @PutMapping
    @Operation(summary = "Update an category", description = "Update an existed category")
    public ResponseEntity<?> update(
            @RequestBody @Valid CategoryRequest request
    ) {
//        try {
        return ResponseUtils.handleSuccess(service.update(request));
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }

}
