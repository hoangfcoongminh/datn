package com.edward.cook_craft.model;

import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.dto.response.RecipeResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Duration;

/**
 * BẢNG CÔNG THỨC
 */

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@Table(name = "recipes")
public class Recipe extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long categoryId;

    private Long authorId;  // ID of the user who created the recipe

    private String title;

    private String description;

    private Duration prepTime;

    private Duration cookTime;

    private Integer servings;   //Serve for how many people

    public static Recipe of(RecipeRequest request) {
        return Recipe.builder()
                .categoryId(request.getCategoryId())
                .authorId(request.getAuthorId())
                .title(request.getTitle())
                .description(request.getDescription())
                .prepTime(request.getPrepTime())
                .cookTime(request.getCookTime())
                .servings(request.getServings())
                .build();
    }

    public static RecipeResponse toResponse(Recipe recipe) {
        return RecipeResponse.builder()
                .id(recipe.getId())
                .categoryId(recipe.getCategoryId())
                .authorId(recipe.getAuthorId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .prepTime(recipe.getPrepTime())
                .cookTime(recipe.getCookTime())
                .servings(recipe.getServings())
                .build();
    }
}
