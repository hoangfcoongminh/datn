package com.edward.cook_craft.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecipeIngredientDetailRequest {

    private Long id;

    private Long recipeId;

    private Long ingredientId;

    private Long actualUnitId;

    private BigDecimal quantity;
}
