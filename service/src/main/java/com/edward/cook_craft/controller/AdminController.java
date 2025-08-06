package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.DashBoardRequest;
import com.edward.cook_craft.security.admin.DashboardService;
import com.edward.cook_craft.utils.ResponseUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard/recipes/year/{year}")
    public ResponseEntity<?> dashboardByYear(
            @PathVariable Integer year
    ){
        return ResponseUtils.handleSuccess(dashboardService.getRecipesByYear(year));
    }

    @GetMapping("/dashboard/recipes/month")
    public ResponseEntity<?> dashboardByMonth(
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month
    ){
        return ResponseUtils.handleSuccess(dashboardService.getRecipesByMonth(year, month));
    }

    @PostMapping("/dashboard/recipes/year")
    public ResponseEntity<?> dashboardByMonth(
            @RequestBody DashBoardRequest request
    ){
        return ResponseUtils.handleSuccess(dashboardService.getRecipesByMonthRange(request));
    }

    @PostMapping("/dashboard/recipes/month")
    public ResponseEntity<?> dashboardByDate(
            @RequestBody DashBoardRequest request
    ){
        return ResponseUtils.handleSuccess(dashboardService.getRecipesByDateRange(request));
    }

}
