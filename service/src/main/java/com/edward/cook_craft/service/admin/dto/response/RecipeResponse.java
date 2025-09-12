package com.edward.cook_craft.service.admin.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class RecipeResponse {

    private Long id;

    private Long categoryId;

    private String authorUsername;  // username of the user who created the recipe

    private String title;

    private String description;

    private BigDecimal prepTime; //hours

    private BigDecimal cookTime; //hours

    private Integer servings;   //Serve for how many people

    private String imgUrl;

    private String videoUrl;

    private Long viewCount = 0L;

    private Float averageRating;

    private Integer totalRating;

    private Integer status;

}
