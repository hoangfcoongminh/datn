package com.edward.cook_craft.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecipeTrainingDTO {

    private Long id;
    private String title;
    private String category;
    private String description;
    private BigDecimal prepTime;
    private BigDecimal cookTime;
    private Integer servings;
    private List<IngredientDTO> ingredients;
    private List<String> steps;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class IngredientDTO {
        private String name;
        private BigDecimal quantity;
        private String unit;
    }
}
