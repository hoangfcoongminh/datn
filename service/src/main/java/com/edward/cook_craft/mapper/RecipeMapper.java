package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.model.Recipe;
import org.springframework.stereotype.Component;

@Component
public class RecipeMapper {

    public RecipeResponse toResponse(Recipe recipe) {
        return RecipeResponse.builder()
                .id(recipe.getId())
                .categoryId(recipe.getCategoryId())
                .authorId(recipe.getAuthorId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .prepTime(recipe.getPrepTime())
                .cookTime(recipe.getCookTime())
                .servings(recipe.getServings())
                .createdAt(recipe.getCreatedAt())
                .createdBy(recipe.getCreatedBy())
                .modifiedAt(recipe.getModifiedAt())
                .modifiedBy(recipe.getModifiedBy())
                .status(recipe.getStatus())
                .version(recipe.getVersion())
                .build();
    }
    public Recipe of(RecipeRequest request) {
        return Recipe.builder()
                .id(request.getId())
                .categoryId(request.getCategoryId())
                .authorId(request.getAuthorId())
                .title(request.getTitle())
                .description(request.getDescription())
                .prepTime(request.getPrepTime())
                .cookTime(request.getCookTime())
                .servings(request.getServings())
                .build();
    }
}
