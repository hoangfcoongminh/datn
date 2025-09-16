package com.edward.cook_craft.service.admin;

import com.edward.cook_craft.mapper.GenericMapper;
import com.edward.cook_craft.model.*;
import com.edward.cook_craft.repository.*;
import com.edward.cook_craft.service.admin.dto.request.*;
import com.edward.cook_craft.service.admin.dto.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final IngredientRepository ingredientRepository;
    private final UnitRepository unitRepository;
    private final ReviewRepository reviewRepository;

    public Page<UserResponse> getAllUsers(UserRequest request, Pageable pageable) {
        Page<User> users = userRepository.getUserForAdmin(request.getSearch(), request.getStatus(), request.getRole(), pageable);

        List<UserResponse> response = GenericMapper.mapList(users.getContent(), UserResponse.class);

        return new PageImpl<>(response, pageable, users.getTotalElements());
    }

    public Page<RecipeResponse> getAllRecipes(RecipeRequest request, Pageable pageable) {
        Page<Recipe> recipes = recipeRepository.getAllRecipesForAdmin(request.getSearch(), request.getCategoryIds(), request.getAuthorUsernames(), request.getStatus(), pageable);

        List<RecipeResponse> response = GenericMapper.mapList(recipes.getContent(), RecipeResponse.class);

        Map<Long, List<Review>> reviewMap = reviewRepository.findAllActive().stream()
                .collect(Collectors.groupingBy(Review::getRecipeId, Collectors.toList()));

        Map<Long, Pair<Float, Integer>> recipeReviewMap = new HashMap<>();

        recipes.getContent().forEach(recipe -> {
            List<Review> reviews = reviewMap.get(recipe.getId());
            float average = 0.0f;
            int total = 0;
            if (reviews != null) {
                average = (float) reviews.stream().mapToDouble(Review::getRating)  // lấy rating
                        .average()                       // tính trung bình
                        .orElse(0.0);              // nếu list rỗng thì trả về 0
                total = reviews.size();
            }
            recipeReviewMap.put(recipe.getId(), Pair.of(average, total));
        });

        response.forEach(r -> {
            r.setAverageRating(recipeReviewMap.get(r.getId()).getFirst());
            r.setTotalRating(recipeReviewMap.get(r.getId()).getSecond());
        });

        return new PageImpl<>(response, pageable, recipes.getTotalElements());
    }

    public Page<CategoryResponse> getAllCategories(CategoryRequest request, Pageable pageable) {
        Page<Category> categories = categoryRepository.getAllCategoriesForAdmin(request.getSearch(), request.getStatus(), pageable);

        List<CategoryResponse> response = GenericMapper.mapList(categories.getContent(), CategoryResponse.class);

        return new PageImpl<>(response, pageable, categories.getTotalElements());
    }

    public Page<IngredientResponse> getAllIngredients(IngredientRequest request, Pageable pageable) {
        Page<Ingredient> ingredients = ingredientRepository.getAllIngredientsForAdmin(request.getSearch(), request.getStatus(), pageable);

        List<IngredientResponse> response = GenericMapper.mapList(ingredients.getContent(), IngredientResponse.class);

        return new PageImpl<>(response, pageable, ingredients.getTotalElements());
    }

    public Page<UnitResponse> getAllUnits(UnitRequest request, Pageable pageable) {
        Page<Unit> ingredients = unitRepository.getAllUnitsForAdmin(request.getSearch(), request.getStatus(), pageable);

        List<UnitResponse> response = GenericMapper.mapList(ingredients.getContent(), UnitResponse.class);

        return new PageImpl<>(response, pageable, ingredients.getTotalElements());
    }
}
