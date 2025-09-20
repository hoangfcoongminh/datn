package com.edward.cook_craft.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Valid
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecipeRequest {

    private Long id;

    private Long categoryId;

    private String authorUsername;  // username of the user who created the recipe

    private String title;

    private String description;

    private BigDecimal prepTime;

    private BigDecimal cookTime;

    private Integer servings;   //Serve for how many people

    private Integer status;

    private List<RecipeIngredientDetailRequest> ingredients;

    private List<RecipeStepRequest> steps;
}
