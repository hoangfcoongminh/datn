package com.edward.cook_craft.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Valid
public class IngredientRequest {

    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private Long unitId;

    private String search;

    private List<Long> unitIds;

    private String description;

    private Integer status;
}
