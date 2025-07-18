package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.CategoryRequest;
import com.edward.cook_craft.dto.response.ApiResponse;
import com.edward.cook_craft.dto.response.CategoryResponse;
import com.edward.cook_craft.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories/")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(ApiResponse.success(service.getAll()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
        }
    }

    @PostMapping
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
