package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.IngredientRequest;
import com.edward.cook_craft.dto.response.ApiResponse;
import com.edward.cook_craft.service.IngredientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ingredients/")
@RequiredArgsConstructor
@Tag(name = "Ingredients", description = "Ingredient management API")
public class IngredientController {

    private final IngredientService service;

    @GetMapping
    @Operation(summary = "Get all ingredients", description = "Retrieve a list of all ingredients")
    public ResponseEntity<?> getAll() {
//        try {
            return ResponseEntity.ok(ApiResponse.success(service.getAll()));
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }

    @PostMapping
    @Operation(summary = "Create a new ingredient", description = "Add a new ingredient to the system")
    public ResponseEntity<?> create(
            @RequestBody IngredientRequest request
    ) {
//        try {
            return ResponseEntity.ok(ApiResponse.success(service.create(request)));
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }
}
