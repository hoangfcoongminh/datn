package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.RecipeFilterRequest;
import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.service.RecipeService;
import com.edward.cook_craft.utils.ResponseUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@Tag(name = "Recipes", description = "Recipe management API")
public class RecipeController {

    private final RecipeService service;

    @GetMapping
    @Operation(summary = "Get all recipes", description = "Retrieve a list of all recipes")
    public ResponseEntity<?> getAll() {
        return ResponseUtils.handleSuccess(service.getAll());
    }

    @PostMapping("/filter")
    @Operation(summary = "Filter recipes", description = "Filter recipes")
    public ResponseEntity<?> filter(
            @RequestBody RecipeFilterRequest request,
            Pageable pageable
    ) {
        return ResponseUtils.handleSuccess(service.filter(request, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detail", description = "Get Detail")
    public ResponseEntity<?> details(
            @PathVariable Long id
    ) {
        return ResponseUtils.handleSuccess(service.details(id));
    }

    @PostMapping
    @Operation(summary = "Create a new recipe", description = "Add a new recipe to the system")
    public ResponseEntity<?> create(
            @RequestPart String jsonRequest,
            @RequestPart(name = "img", required = false) MultipartFile img
    ) {
        return ResponseUtils.handleSuccess(service.create(jsonRequest, img));
    }

    @PutMapping
    @Operation(summary = "Update a recipe", description = "Update a recipe to the system")
    public ResponseEntity<?> update(
            @RequestPart String jsonRequest,
            @RequestPart(name = "img", required = false) MultipartFile img
    ) {
        return ResponseUtils.handleSuccess(service.update(jsonRequest, img));
    }

}
