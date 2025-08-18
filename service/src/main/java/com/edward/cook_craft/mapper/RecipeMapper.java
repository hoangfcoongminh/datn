package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.model.Recipe;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecipeMapper {

    public RecipeResponse toResponse(Recipe recipe) {
        return RecipeResponse.builder()
                .id(recipe.getId())
                .categoryId(recipe.getCategoryId())
                .authorUsername(recipe.getAuthorUsername())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .prepTime(recipe.getPrepTime())
                .cookTime(recipe.getCookTime())
                .servings(recipe.getServings())
                .imgUrl(recipe.getImgUrl())
                .videoUrl(recipe.getVideoUrl())
                .viewCount(recipe.getViewCount())
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
                .authorUsername(request.getAuthorUsername())
                .title(request.getTitle())
                .description(request.getDescription())
                .prepTime(request.getPrepTime())
                .cookTime(request.getCookTime())
                .servings(request.getServings())
                .viewCount(0L)
                .build();
    }
}
