package com.edward.cook_craft.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class RecipeIngredientDetailResponse {

    private Long id;

    private Long recipeId;

    private Long ingredientId;

    private Long actualUnitId;

    private BigDecimal quantity;
}
