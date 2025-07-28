package com.edward.cook_craft.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

import java.util.List;

@Getter
@Setter
@SuperBuilder
public class RecipeDetailResponse extends RecipeResponse{

    List<Long> recipeIngredientIds;
    List<Long> recipeStepIds;

    public RecipeDetailResponse(RecipeResponse recipeResponse) {
        BeanUtils.copyProperties(recipeResponse, this);
    }
}
