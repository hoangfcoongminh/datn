package com.edward.cook_craft.service.recommendation;

import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.model.Favorite;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.model.Review;
import com.edward.cook_craft.repository.FavoriteRepository;
import com.edward.cook_craft.repository.RecipeRepository;
import com.edward.cook_craft.repository.ReviewRepository;
import com.edward.cook_craft.utils.RecipeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class RelatedRecommendationService {

    private final RecipeRepository recipeRepository;
    private final ReviewRepository reviewRepository;
    private final FavoriteRepository favoriteRepository;
    private final RecipeUtils recipeUtils;

    public List<RecipeResponse> getRelatedRecipes(Long recipeId) {
        try {
            Recipe current = recipeRepository.getByIdAndActive(recipeId).orElse(null);
            if (current == null) return List.of();

            List<Recipe> contentBased = recipeRepository.findByCategoryId(current.getCategoryId()).stream()
                    .filter(r -> !r.getId().equals(recipeId))
                    .limit(5)
                    .toList();

            Set<Long> userIds = Stream.concat(
                    reviewRepository.findByRecipeIdAndActive(recipeId).stream().map(Review::getUserId),
                    favoriteRepository.findByRecipeId(recipeId).stream().map(Favorite::getUserId)
            ).collect(Collectors.toSet());

            Set<Long> relatedRecipeIds = new HashSet<>();
            for (Long userId : userIds) {
                reviewRepository.findByUserId(userId).stream()
                        .filter(r -> r.getRating() >= 4 && !r.getRecipeId().equals(recipeId))
                        .forEach(r -> relatedRecipeIds.add(r.getRecipeId()));

                favoriteRepository.findAllFavoriteByUserId(userId).stream()
                        .filter(f -> !f.getRecipeId().equals(recipeId))
                        .forEach(f -> relatedRecipeIds.add(f.getRecipeId()));
            }

            List<Recipe> communityBased = recipeRepository.findAllById(relatedRecipeIds);

            List<Recipe> suggestions = new ArrayList<>(Stream.concat(contentBased.stream(), communityBased.stream())
                    .distinct()
                    .limit(10)
                    .toList());
            if (suggestions.size() < 10) {
                List<Recipe> topView = recipeRepository.findTopViewExcludeIds(
                        suggestions.stream().map(Recipe::getId).toList());
                suggestions.addAll(topView);
            }

            return recipeUtils.mapWithExtraInfo(suggestions);
        } catch (Exception e) {
            return null;
        }
    }
}
