package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.request.RecipeIngredientDetailRequest;
import com.edward.cook_craft.dto.request.RecipeStepRequest;
import com.edward.cook_craft.dto.response.RecipeIngredientDetailResponse;
import com.edward.cook_craft.dto.response.RecipeStepResponse;
import com.edward.cook_craft.model.RecipeIngredientDetail;
import com.edward.cook_craft.model.RecipeStep;
import org.springframework.stereotype.Component;

@Component
public class RecipeStepMapper {

    public RecipeStep of(RecipeStepRequest request) {
        return RecipeStep.builder()
                .recipeId(request.getRecipeId())
                .stepNumber(request.getStepNumber())
                .stepInstruction(request.getStepInstruction())
                .build();
    }

    public RecipeStepResponse toResponse(RecipeStep data) {
        return RecipeStepResponse.builder()
                .id(data.getId())
                .recipeId(data.getRecipeId())
                .stepNumber(data.getStepNumber())
                .stepInstruction(data.getStepInstruction())
                .build();
    }
}
