package com.edward.cook_craft.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.Duration;

@Getter
@Valid
public class RecipeRequest {

    private Long id;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long authorId;  // ID of the user who created the recipe

    @NotBlank
    private String title;

    private String description;

    private Duration prepTime;

    private Duration cookTime;

    private Integer servings;   //Serve for how many people

    private Integer status;
}
