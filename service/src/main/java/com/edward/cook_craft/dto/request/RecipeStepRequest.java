package com.edward.cook_craft.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipeStepRequest {

    private Long id;

    private Long recipeId;

    private Integer stepNumber;

    private String stepInstruction;
}
