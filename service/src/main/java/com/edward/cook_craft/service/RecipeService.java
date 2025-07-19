package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.repository.CategoryRepository;
import com.edward.cook_craft.repository.RecipeRepository;
import com.edward.cook_craft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository repository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<RecipeResponse> getAll() {
        return repository.findAll().stream()
                .map(Recipe::toResponse).toList();
    }

    public RecipeResponse create(RecipeRequest request) {
        Recipe recipe = validateRecipeRequest(request);

        return Recipe.toResponse(repository.save(recipe))   ;
    }

    private Recipe validateRecipeRequest(RecipeRequest request) {
        if (categoryRepository.findById(request.getCategoryId()).isEmpty()) {
            throw new CustomException("category-not-found");
        }

        if (userRepository.findById(request.getAuthorId()).isEmpty()) {
            throw new CustomException("user-not-found");
        }

        if (request.getTitle() == null || request.getTitle().isEmpty()) {
            throw new CustomException("title-required");
        }

        if (request.getCookTime() == null) {
            throw new CustomException("cook-time-required");
        }

        return Recipe.of(request);
    }
}
