package com.edward.cook_craft.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RecipeStepResponse {

    private Long id;

    private Long recipeId;

    private Integer stepNumber;

    private String stepInstruction;
}
