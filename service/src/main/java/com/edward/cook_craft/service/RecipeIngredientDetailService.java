package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.response.RecipeIngredientDetailResponse;
import com.edward.cook_craft.model.RecipeIngredientDetail;
import com.edward.cook_craft.repository.RecipeIngredientDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeIngredientDetailService {

    private final RecipeIngredientDetailRepository recipeIngredientDetailRepository;

    public List<RecipeIngredientDetailResponse> getAll() {
        return recipeIngredientDetailRepository.findAll().stream().map(RecipeIngredientDetail::toResponse).toList();
    }
}
