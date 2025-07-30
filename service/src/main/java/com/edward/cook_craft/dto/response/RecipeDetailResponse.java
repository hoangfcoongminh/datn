package com.edward.cook_craft.dto.response;

import com.edward.cook_craft.model.RecipeIngredientDetail;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

import java.util.List;

@Getter
@Setter
@SuperBuilder
public class RecipeDetailResponse extends RecipeResponse{

    List<RecipeIngredientDetailResponse> recipeIngredients;
    List<RecipeStepResponse> recipeSteps;

    public RecipeDetailResponse(RecipeResponse recipeResponse) {
        BeanUtils.copyProperties(recipeResponse, this);
    }
}
