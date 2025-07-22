package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.service.RecipeService;
import com.edward.cook_craft.utils.ResponseUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes/")
@RequiredArgsConstructor
@Tag(name = "Recipes", description = "Recipe management API")
public class RecipeController {

    private final RecipeService service;

    @GetMapping
    @Operation(summary = "Get all recipes", description = "Retrieve a list of all recipes")
    public ResponseEntity<?> getAll() {
//        try {
            return ResponseUtils.handleSuccess(service.getAll());
//        } catch (Exception e) {
//            return ApiResponse.failure(e.getMessage());
//        }
    }

    @PostMapping
    @Operation(summary = "Create a new recipe", description = "Add a new recipe to the system")
    public ResponseEntity<?> create(
            @RequestBody @Valid RecipeRequest request
    ) {
//        try {
            return ResponseUtils.handleSuccess(service.create(request));
//        } catch (Exception e) {
//            return ApiResponse.failure(e.getMessage());
//        }
    }

    @PutMapping
    @Operation(summary = "Update a recipe", description = "Update a recipe to the system")
    public ResponseEntity<?> update(
            @RequestBody @Valid RecipeRequest request
    ) {
//        try {
        return ResponseUtils.handleSuccess(service.update(request));
//        } catch (Exception e) {
//            return ApiResponse.failure(e.getMessage());
//        }
    }

}
