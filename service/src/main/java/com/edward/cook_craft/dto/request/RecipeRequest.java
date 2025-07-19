package com.edward.cook_craft.dto.request;

import lombok.Getter;

import java.time.Duration;

@Getter
public class RecipeRequest {

    private Long categoryId;

    private Long authorId;  // ID of the user who created the recipe

    private String title;

    private String description;

    private Duration prepTime;

    private Duration cookTime;

    private Integer servings;   //Serve for how many people
}
