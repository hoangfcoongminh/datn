package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.model.Recipe;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecipeMapper {

    private final ObjectMapper objectMapper;

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
                .build();
    }

    public RecipeRequest mapStringRequest(String jsonRequest) {
        try {
            return objectMapper.readValue(jsonRequest, RecipeRequest.class);
        } catch (JsonProcessingException e) {
            throw new CustomException("fail.to.map.json " + e.getMessage());
        }
    }
}
