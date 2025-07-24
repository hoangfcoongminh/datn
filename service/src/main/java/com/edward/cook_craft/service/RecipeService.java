package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.RecipeMapper;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.CategoryRepository;
import com.edward.cook_craft.repository.RecipeRepository;
import com.edward.cook_craft.repository.UserRepository;
import com.edward.cook_craft.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository repository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RecipeMapper recipeMapper;

    public List<RecipeResponse> getAll() {
        return repository.findAll().stream()
                .map(recipeMapper::toResponse).toList();
    }

    @Transactional
    public RecipeResponse create(RecipeRequest request) {
        validateRecipeRequest(request);
        Recipe recipe = recipeMapper.of(request);
        User currentUser = SecurityUtils.getCurrentUser();
        recipe.setCreatedBy(currentUser.getUsername());

        return recipeMapper.toResponse(repository.save(recipe));
    }

    @Transactional
    public RecipeResponse update(RecipeRequest request) {
        validateRecipeRequest(request);
        Recipe recipe = repository.findById(request.getId()).get();
        User currentUser = SecurityUtils.getCurrentUser();
        setData(recipe, request);
        recipe.setModifiedBy(currentUser.getUsername());

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

    private Recipe setData(Recipe r, RecipeRequest request) {
        r.setCategoryId(request.getCategoryId());
        r.setAuthorId(request.getAuthorId());
        r.setTitle(request.getTitle());
        r.setDescription(request.getDescription());
        r.setPrepTime(request.getPrepTime());
        r.setCookTime(request.getCookTime());
        r.setServings(request.getServings());
        r.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus(): request.getStatus());

        return r;
    }
}
