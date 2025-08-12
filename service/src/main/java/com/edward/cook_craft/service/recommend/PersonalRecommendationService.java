package com.edward.cook_craft.service.recommend;

import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.RecipeMapper;
import com.edward.cook_craft.model.Favorite;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.model.Review;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.FavoriteRepository;
import com.edward.cook_craft.repository.RecipeRepository;
import com.edward.cook_craft.repository.ReviewRepository;
import com.edward.cook_craft.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PersonalRecommendationService {

    private final FavoriteRepository favoriteRepository;
    private final RecipeRepository recipeRepository;
    private final ReviewRepository reviewRepository;
    private final RecipeMapper recipeMapper;

    public List<RecipeResponse> getRecommendationsForUser() {
        User user = SecurityUtils.getCurrentUser();
        if (user == null) {
            List<Recipe> recipes = recipeRepository.findTop10ViewRecipes();
            return recipes.stream().map(recipeMapper::toResponse).toList();
        }
        Long userId = user.getId();

        List<Review> myReviews = reviewRepository.findByUserId(userId);
        List<Favorite> myFavorites = favoriteRepository.findAllFavoriteByUserId(userId);

        Set<Long> interactedRecipeIds = Stream.concat(
                myReviews.stream().map(Review::getRecipeId),
                myFavorites.stream().map(Favorite::getRecipeId)
        ).collect(Collectors.toSet());

        Set<Long> similarUsers = findSimilarUsers(userId, myReviews, myFavorites);
        List<Review> l = reviewRepository.findAllActive();
        List<Long> cfRecipeIds = l.stream()
                .filter(r -> similarUsers.contains(r.getUserId()))
                .filter(r -> r.getRating() >= 4)
                .map(Review::getRecipeId)
                .filter(id -> !interactedRecipeIds.contains(id))
                .distinct()
                .toList();

        List<Recipe> suggestions = recipeRepository.findAllByIdActive(cfRecipeIds);

        if (suggestions.size() < 5) {
            List<Recipe> cbResults = contentBasedSuggestion(myReviews, myFavorites, interactedRecipeIds);
            suggestions.addAll(cbResults);
        }

        return suggestions.stream().distinct().limit(10).map(recipeMapper::toResponse).toList();
    }

    private Set<Long> findSimilarUsers(Long userId, List<Review> myReviews, List<Favorite> myFavorites) {
        Set<Long> highRatedOrFav = Stream.concat(
                myReviews.stream().filter(r -> r.getRating() >= 4).map(Review::getRecipeId),
                myFavorites.stream().map(Favorite::getRecipeId)
        ).collect(Collectors.toSet());

        return reviewRepository.findAllActive().stream()
                .filter(r -> !r.getUserId().equals(userId))
                .filter(r -> highRatedOrFav.contains(r.getRecipeId()) && r.getRating() >= 4)
                .map(Review::getUserId)
                .collect(Collectors.toSet());
    }

    private List<Recipe> contentBasedSuggestion(List<Review> myReviews, List<Favorite> myFavorites, Set<Long> interactedRecipeIds) {
        Map<Long, Long> categoryCount = Stream.concat(
                        myReviews.stream().filter(r -> r.getRating() >= 4).map(r -> recipeRepository.getByIdAndActive(r.getRecipeId()).orElse(null)),
                        myFavorites.stream().map(f -> recipeRepository.getByIdAndActive(f.getRecipeId()).orElse(null))
                )
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(Recipe::getCategoryId, Collectors.counting()));

        Long favCategory = categoryCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        if (favCategory == null) return List.of();

        return recipeRepository.findByCategoryId(favCategory).stream()
                .filter(r -> !interactedRecipeIds.contains(r.getId()))
                .limit(5)
                .toList();
    }

}
