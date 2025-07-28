package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.UnitRequest;
import com.edward.cook_craft.service.UnitService;
import com.edward.cook_craft.utils.ResponseUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
@Tag(name = "Units", description = "Unit management API")
public class UnitController {

    private final UnitService service;

    @GetMapping
    @Operation(summary = "Get all units", description = "Retrieve a list of all units")
    public ResponseEntity<?> getAll() {
//        try {
            return ResponseUtils.handleSuccess(service.getAll());
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }

    @PostMapping
    @Operation(summary = "Create a new unit", description = "Add a new unit to the system")
    public ResponseEntity<?> create(
            @RequestBody UnitRequest request
    ) {
//        try {
            return ResponseUtils.handleSuccess(service.create(request));
//        } catch (Exception e) {
//            return ResponseEntity.ok(ApiResponse.failure(e.getMessage()));
//        }
    }
}
