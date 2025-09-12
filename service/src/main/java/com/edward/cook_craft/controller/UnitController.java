package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.UnitRequest;
import com.edward.cook_craft.service.UnitService;
import com.edward.cook_craft.utils.ResponseUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
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
        return ResponseUtils.handleSuccess(service.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detail unit", description = "Detail of an unit")
    public ResponseEntity<?> details(
            @PathVariable Long id
    ) {
        return ResponseUtils.handleSuccess(service.details(id));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter units", description = "Filter all units")
    public ResponseEntity<?> filter(
            @RequestParam String name,
            Pageable pageable
    ) {
        return ResponseUtils.handleSuccess(service.filter(name, pageable));
    }

    @PostMapping
    @Operation(summary = "Create a new unit", description = "Add a new unit to the system")
    public ResponseEntity<?> create(
            @RequestBody UnitRequest request
    ) {
        return ResponseUtils.handleSuccess(service.create(request));
    }

    @PutMapping
    @Operation(summary = "Update a new unit", description = "Update an unit to the system")
    public ResponseEntity<?> update(
            @RequestBody UnitRequest request
    ) {
        return ResponseUtils.handleSuccess(service.update(request));

    }
}
