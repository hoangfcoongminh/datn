package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.request.RecipeIngredientDetailRequest;
import com.edward.cook_craft.dto.response.RecipeIngredientDetailResponse;
import com.edward.cook_craft.model.RecipeIngredientDetail;
import org.springframework.stereotype.Component;

@Component
public class RecipeIngredientDetailMapper {

    public RecipeIngredientDetail of(RecipeIngredientDetailRequest request) {
        return RecipeIngredientDetail.builder()
                .recipeId(request.getRecipeId())
                .ingredientId(request.getIngredientId())
                .actualUnitId(request.getActualUnitId())
                .quantity(request.getQuantity())
                .build();
    }

    public RecipeIngredientDetailResponse toResponse(RecipeIngredientDetail data) {
        return RecipeIngredientDetailResponse.builder()
                .id(data.getId())
                .recipeId(data.getRecipeId())
                .ingredientId(data.getIngredientId())
                .actualUnitId(data.getActualUnitId())
                .quantity(data.getQuantity())
                .build();
    }
}
