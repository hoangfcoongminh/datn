package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.DashBoardRequest;
import com.edward.cook_craft.security.admin.DashboardService;
import com.edward.cook_craft.utils.ResponseUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard/recipes/year")
    public ResponseEntity<?> dashboardByYear(
            @RequestParam("year") Integer year
    ) {
        return ResponseUtils.handleSuccess(dashboardService.getRecipesByYear(year));
    }

    @GetMapping("/dashboard/recipes/month")
    public ResponseEntity<?> dashboardByMonth(
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month
    ) {
        return ResponseUtils.handleSuccess(dashboardService.getRecipesByMonth(year, month));
    }

    @GetMapping("/dashboard/recipes/year-range")
    public ResponseEntity<?> dashboardByMonthRange(
            @RequestParam("year") Integer year
    ) {
        DashBoardRequest request = DashBoardRequest.builder().year(year).build();
        return ResponseUtils.handleSuccess(dashboardService.getRecipesByMonthRange(request));
    }

    @GetMapping("/dashboard/recipes/date-range")
    public ResponseEntity<?> dashboardByDateRange(
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate
    ) {
        DashBoardRequest request = DashBoardRequest.builder()
                .startDate(startDate)
                .endDate(endDate)
                .build();
        return ResponseUtils.handleSuccess(dashboardService.getRecipesByDateRange(request));
    }

}
