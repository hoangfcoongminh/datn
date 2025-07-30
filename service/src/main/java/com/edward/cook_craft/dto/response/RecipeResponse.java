package com.edward.cook_craft.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.Duration;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeResponse extends BaseResponse {

    private Long id;

    private Long categoryId;

    private Long authorId;  // ID of the user who created the recipe

    private String title;

    private String description;

    private BigDecimal prepTime;

    private BigDecimal cookTime;

    private Integer servings;   //Serve for how many people

    private String imgUrl;
}
