package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.DashBoardRequest;
import com.edward.cook_craft.dto.request.RecipeFilterRequest;
import com.edward.cook_craft.service.admin.AdminService;
import com.edward.cook_craft.service.admin.DashboardService;
import com.edward.cook_craft.service.admin.dto.request.UserRequest;
import com.edward.cook_craft.utils.ResponseUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DashboardService dashboardService;
    private final AdminService adminService;

    @GetMapping("/dashboard/recipes")
    public ResponseEntity<?> getRecipeStats(
            @RequestParam("groupBy") DashboardService.GroupBy groupBy,
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        DashBoardRequest req = DashBoardRequest.builder()
                .startDate(startDate)
                .endDate(endDate)
                .build();
        return ResponseUtils.handleSuccess(dashboardService.getRecipeStats(req, groupBy));
    }

    @GetMapping("/dashboard/users")
    public ResponseEntity<?> getUserStats(
            @RequestParam("groupBy") DashboardService.GroupBy groupBy,
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        DashBoardRequest req = DashBoardRequest.builder()
                .startDate(startDate)
                .endDate(endDate)
                .build();
        return ResponseUtils.handleSuccess(dashboardService.getUserStats(req, groupBy));
    }

    @GetMapping("/dashboard/activity")
    public ResponseEntity<?> getUserActivity(
            @RequestParam("groupBy") DashboardService.GroupBy groupBy,
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        DashBoardRequest req = DashBoardRequest.builder()
                .startDate(startDate)
                .endDate(endDate)
                .build();
        return ResponseUtils.handleSuccess(dashboardService.getUserActivity(req, groupBy));
    }

    @PostMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestBody UserRequest userRequest,
            Pageable pageable
    ) {
        return ResponseUtils.handleSuccess(adminService.getAllUsers(userRequest, pageable));
    }

    @PostMapping("/recipes")
    public ResponseEntity<?> getAllRecipes(
            @RequestBody RecipeFilterRequest request,
            Pageable pageable
    ) {
        return ResponseUtils.handleSuccess(adminService.getAllRecipes(request, pageable));
    }
    }
