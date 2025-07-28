package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.RecipeFilterRequest;
import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.dto.response.PagedResponse;
import com.edward.cook_craft.dto.response.RecipeDetailResponse;
import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.PageMapper;
import com.edward.cook_craft.mapper.RecipeMapper;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository repository;
    private final CategoryRepository categoryRepository;
    private final RecipeIngredientDetailRepository recipeIngredientDetailRepository;
    private final RecipeStepRepository recipeStepRepository;
    private final UserRepository userRepository;
    private final RecipeMapper recipeMapper;
    private final PageMapper pageMapper;

    public List<RecipeResponse> getAll() {
        return repository.findAll().stream()
                .map(recipeMapper::toResponse).toList();
    }

    public PagedResponse<?> filter(RecipeFilterRequest request, Pageable pageable) {
        String keyword = request.getKeyword() == null || request.getKeyword().isEmpty() ? null : request.getKeyword().toLowerCase();
        List<Long> categoryIds = request.getCategoryIds() == null || request.getCategoryIds().isEmpty() ? null : request.getCategoryIds();
        List<Long> ingredientIds = request.getIngredientIds() == null || request.getIngredientIds().isEmpty() ? null : request.getIngredientIds();
        List<Long> authorIds = request.getAuthorIds() == null || request.getAuthorIds().isEmpty() ? null : request.getAuthorIds();

        Page<Recipe> data = repository.filter(
                keyword, categoryIds, ingredientIds, authorIds, pageable);
        return pageMapper.map(data, recipeMapper::toResponse);
    }

    public RecipeDetailResponse details(Long id) {
        Optional<Recipe> recipe = repository.findById(id);
        if (recipe.isEmpty()) {
            throw new CustomException("recipe.not.found");
        }
        Recipe recipeData = recipe.get();
        RecipeDetailResponse response = new RecipeDetailResponse(recipeMapper.toResponse(recipeData));

        List<Long> recipeIngredientIds = recipeIngredientDetailRepository.findByRecipeId(id);
        List<Long> recipeStepIds = recipeStepRepository.findByRecipeId(id);
        response.setRecipeIngredientIds(recipeIngredientIds);
        response.setRecipeStepIds(recipeStepIds);
        return response;
    }

    @Transactional
    public RecipeResponse create(RecipeRequest request) {
        validateRecipeRequest(request);
        Recipe recipe = recipeMapper.of(request);

        return recipeMapper.toResponse(repository.save(recipe));
    }

    @Transactional
    public RecipeResponse update(RecipeRequest request) {
        validateRecipeRequest(request);
        Recipe recipe = repository.findById(request.getId()).get();
        setData(recipe, request);

        return recipeMapper.toResponse(repository.save(recipe));
    }

    private void validateRecipeRequest(RecipeRequest request) {
        if (request.getId() != null && !repository.existsById(request.getId())) {
            throw new CustomException("recipe-not-found");
        }

        if (categoryRepository.findByIdAndStatus(request.getCategoryId(), EntityStatus.ACTIVE.getStatus()).isEmpty()) {
            throw new CustomException("category-not-found");
        }

        if (userRepository.findById(request.getAuthorId()).isEmpty()) {
            throw new CustomException("user-not-found");
        }
    }

    private void setData(Recipe r, RecipeRequest request) {
        r.setCategoryId(request.getCategoryId());
        r.setAuthorId(request.getAuthorId());
        r.setTitle(request.getTitle());
        r.setDescription(request.getDescription());
        r.setPrepTime(request.getPrepTime());
        r.setCookTime(request.getCookTime());
        r.setServings(request.getServings());
        r.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus() : request.getStatus());

    }
}
