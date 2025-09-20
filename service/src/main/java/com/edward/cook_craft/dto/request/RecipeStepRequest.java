package com.edward.cook_craft.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecipeStepRequest {

    private Long id;

    private Long recipeId;

    private Integer stepNumber;

    private String stepInstruction;
}
