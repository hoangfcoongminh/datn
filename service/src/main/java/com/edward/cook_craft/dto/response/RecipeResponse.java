package com.edward.cook_craft.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;

@Getter
@Setter
@Builder
public class RecipeResponse {

    private Long id;

    private Long categoryId;

    private Long authorId;  // ID of the user who created the recipe

    private String title;

    private String description;

    private Duration prepTime;

    private Duration cookTime;

    private Integer servings;   //Serve for how many people
}
