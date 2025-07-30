package com.edward.cook_craft.dto.request;

import com.edward.cook_craft.model.RecipeStep;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

@Getter
@Setter
@Valid
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
