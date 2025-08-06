package com.edward.cook_craft.dto.request;

import lombok.Getter;

import java.time.LocalDate;
import java.time.YearMonth;

@Getter
public class DashBoardRequest {

    private YearMonth startMonth; // ví dụ: 2025-01
    private YearMonth endMonth;   // ví dụ: 2025-06
    private LocalDate startDate;
    private LocalDate endDate;
}
