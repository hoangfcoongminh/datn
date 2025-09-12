package com.edward.cook_craft.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class DashBoardRequest {

    private LocalDate startDate;
    private LocalDate endDate;
}
