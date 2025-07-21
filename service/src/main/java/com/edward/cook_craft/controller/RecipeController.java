package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.dto.response.ApiResponse;
import com.edward.cook_craft.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes/")
@RequiredArgsConstructor
@Tag(name = "Recipes", description = "Recipe management API")
public class RecipeController {

    private final RecipeService service;

    @GetMapping
    @Operation(summary = "Get all recipes", description = "Retrieve a list of all recipes")
    public ApiResponse<?> getAll() {
//        try {
            return ApiResponse.success(service.getAll());
//        } catch (Exception e) {
//            return ApiResponse.failure(e.getMessage());
//        }
    }

    @PostMapping
    @Operation(summary = "Create a new recipe", description = "Add a new recipe to the system")
    public ApiResponse<?> create(
            @RequestBody RecipeRequest request
    ) {
//        try {
            return ApiResponse.success(service.create(request));
//        } catch (Exception e) {
//            return ApiResponse.failure(e.getMessage());
//        }
    }
}
