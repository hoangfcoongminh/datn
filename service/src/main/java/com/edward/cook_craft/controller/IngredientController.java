package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.IngredientRequest;
import com.edward.cook_craft.service.IngredientService;
import com.edward.cook_craft.utils.ResponseUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
@Tag(name = "Ingredients", description = "Ingredient management API")
public class IngredientController {

    private final IngredientService service;

    @GetMapping
    @Operation(summary = "Get all ingredients", description = "Retrieve a list of all ingredients")
    public ResponseEntity<?> getAll() {
//        try {
        return ResponseUtils.handleSuccess(service.getAll());
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detail ingredient", description = "Detail of an ingredient")
    public ResponseEntity<?> details(
            @PathVariable Long id
    ) {
        return ResponseUtils.handleSuccess(service.details(id));
    }

    @PostMapping("/filter")
    @Operation(summary = "Filter ingredients", description = "Filter all ingredients")
    public ResponseEntity<?> filter(
            @RequestBody IngredientRequest request,
            Pageable pageable
    ) {
        return ResponseUtils.handleSuccess(service.filter(request, pageable));
    }

    @PostMapping
    @Operation(summary = "Create a new ingredient", description = "Add a new ingredient to the system")
    public ResponseEntity<?> create(
            @RequestPart(name = "jsonRequest") String jsonRequest,
            @RequestPart(name = "img", required = false) MultipartFile file
    ) {
//        try {
        return ResponseUtils.handleSuccess(service.create(jsonRequest, file));
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }

    @PutMapping
    @Operation(summary = "Update an ingredient", description = "Update an existed ingredient")
    public ResponseEntity<?> update(
            @RequestPart(name = "jsonRequest") String jsonRequest,
            @RequestPart(name = "img",  required = false) MultipartFile file
    ) {
//        try {
        return ResponseUtils.handleSuccess(service.update(jsonRequest, file));
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }

}
