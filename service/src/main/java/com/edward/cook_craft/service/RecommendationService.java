package com.edward.cook_craft.service;

import com.edward.cook_craft.model.Favorite;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.repository.FavoriteRepository;
import com.edward.cook_craft.repository.RecipeRepository;
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
public class RecommendationService {

    private final FavoriteRepository favoriteRepository;
    private final RecipeRepository recipeRepository;

    public List<Recipe> getRecommendationsForUser(Long userId) {
        // Lấy review và favorite của user
        List<Review> myReviews = reviewRepo.findByUserId(userId);
        List<Favorite> myFavorites = favoriteRepository.findAllFavoriteByUserId(userId);

        Set<Long> interactedRecipeIds = Stream.concat(
                myReviews.stream().map(Review::getRecipeId),
                myFavorites.stream().map(Favorite::getRecipeId)
        ).collect(Collectors.toSet());

        // 1️⃣ Collaborative Filtering
        Set<Long> similarUsers = findSimilarUsers(userId, myReviews, myFavorites);
        List<Long> cfRecipeIds = reviewRepo.findAll().stream()
                .filter(r -> similarUsers.contains(r.getUserId()))
                .filter(r -> r.getRating() >= 4)
                .map(Review::getRecipeId)
                .filter(id -> !interactedRecipeIds.contains(id))
                .distinct()
                .toList();

        List<Recipe> suggestions = recipeRepository.findAllById(cfRecipeIds);

        // 2️⃣ Content-based fallback
        if (suggestions.size() < 5) {
            List<Recipe> cbResults = contentBasedSuggestion(myReviews, myFavorites, interactedRecipeIds);
            suggestions.addAll(cbResults);
        }

        // 3️⃣ Loại trùng và giới hạn
        return suggestions.stream().distinct().limit(10).toList();
    }

    private Set<Long> findSimilarUsers(Long userId, List<Review> myReviews, List<Favorite> myFavorites) {
        Set<Long> highRatedOrFav = Stream.concat(
                myReviews.stream().filter(r -> r.getRating() >= 4).map(Review::getRecipeId),
                myFavorites.stream().map(Favorite::getRecipeId)
        ).collect(Collectors.toSet());

        return reviewRepo.findAll().stream()
                .filter(r -> !r.getUserId().equals(userId))
                .filter(r -> highRatedOrFav.contains(r.getRecipeId()) && r.getRating() >= 4)
                .map(Review::getUserId)
                .collect(Collectors.toSet());
    }

    private List<Recipe> contentBasedSuggestion(List<Review> myReviews, List<Favorite> myFavorites, Set<Long> interactedRecipeIds) {
        Map<String, Long> categoryCount = Stream.concat(
                        myReviews.stream().filter(r -> r.getRating() >= 4).map(r -> recipeRepo.findById(r.getRecipeId()).orElse(null)),
                        myFavorites.stream().map(f -> recipeRepo.findById(f.getRecipeId()).orElse(null))
                )
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(Recipe::getCategory, Collectors.counting()));

        String favCategory = categoryCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        if (favCategory == null) return List.of();

        return recipeRepository.findByCategory(favCategory).stream()
                .filter(r -> !interactedRecipeIds.contains(r.getId()))
                .limit(5)
                .toList();
    }

}
