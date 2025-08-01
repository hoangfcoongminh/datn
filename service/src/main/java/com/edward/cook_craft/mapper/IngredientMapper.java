package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.request.IngredientRequest;
import com.edward.cook_craft.dto.response.IngredientResponse;
import com.edward.cook_craft.model.Ingredient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IngredientMapper {

    public IngredientResponse toResponse(Ingredient ingredient) {
        return IngredientResponse.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .unitId(ingredient.getUnitId())
                .description(ingredient.getDescription())
                .imgUrl(ingredient.getImgUrl())
                .createdAt(ingredient.getCreatedAt())
                .createdBy(ingredient.getCreatedBy())
                .modifiedAt(ingredient.getModifiedAt())
                .modifiedBy(ingredient.getModifiedBy())
                .status(ingredient.getStatus())
                .version(ingredient.getVersion())
                .build();
    }
            ;
    public Ingredient of(IngredientRequest ingredientRequest) {
        return Ingredient.builder()
                .id(ingredientRequest.getId())
                .name(ingredientRequest.getName())
                .unitId(ingredientRequest.getUnitId())
                .description(ingredientRequest.getDescription())
                .build();
    }

}
