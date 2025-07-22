package com.edward.cook_craft.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Getter
@Setter
@SuperBuilder
public class RecipeIngredientDetailResponse extends BaseResponse {

    private Long id;

    private Long recipeId;

    private Long ingredientId;

    private Long actualUnitId;

    private BigDecimal quantity;
}
