package com.edward.cook_craft.utils;

import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.mapper.RecipeMapper;
import com.edward.cook_craft.model.Favorite;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.model.Review;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.FavoriteRepository;
import com.edward.cook_craft.repository.ReviewRepository;
import com.edward.cook_craft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RecipeUtils {

    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;
    private final RecipeMapper recipeMapper;
    private final UserRepository userRepository;

    public List<RecipeResponse> mapWithExtraInfo(List<Recipe> recipes) {
        if (recipes.isEmpty()) return List.of();
        List<Long> recipeIds = recipes.stream().map(Recipe::getId).toList();

        var ratingMap = getRatingMap(recipeIds);
        var totalFavoriteMap = checkTotalFavoriteForRecipe(recipeIds);
        var authorInforMap = getAuthorInforMap(recipes.stream().map(Recipe::getAuthorUsername).toList());

        List<RecipeResponse> response = recipes.stream().map(recipeMapper::toResponse).toList();
        response.forEach(r -> {
            r.setAverageRating(ratingMap.get(r.getId()).getFirst());
            r.setTotalReview(ratingMap.get(r.getId()).getSecond());
            r.setTotalFavorite(totalFavoriteMap.get(r.getId()));
            r.setAuthorFullName(authorInforMap.get(r.getAuthorUsername()).getFirst());
            r.setAuthorAvtUrl(authorInforMap.get(r.getAuthorUsername()).getSecond());
        });

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            var favoriteMap = checkFavoriteByUser(recipeIds);
            response.forEach(r -> r.setIsFavorite(favoriteMap.getOrDefault(r.getId(), false)));
        }
        return response;
    }

    private Map<Long, Boolean> checkFavoriteByUser(List<Long> recipeIds) {
        User u = SecurityUtils.getCurrentUser();
        if (u == null) {
            return recipeIds.stream().collect(Collectors.toMap(id -> id, id -> false));
        }
        Map<Long, Boolean> favoriteMap = favoriteRepository.findAllFavoriteByUserIdAndRecipeIds(u.getId(), recipeIds)
                .stream()
                .collect(Collectors.toMap(Favorite::getRecipeId, f -> true));

        recipeIds.forEach(id -> favoriteMap.computeIfAbsent(id, k -> false));

        return favoriteMap;
    }

    private Map<Long, Pair<Float, Integer>> getRatingMap(List<Long> recipeIds) {
        var ratingMap = reviewRepository.findByRecipeIdIn(recipeIds)
                .stream()
                .collect(Collectors.groupingBy(
                        Review::getRecipeId,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                reviews -> {
                                    double sum = reviews.stream()
                                            .mapToDouble(review -> review.getRating() != null ? review.getRating() : 0.0)
                                            .sum();
                                    int count = reviews.size();
                                    double average = count > 0 ? sum / count : 0.0;
                                    return Pair.of((float) average, count);
                                }
                        )
                ));
        recipeIds.forEach(id -> ratingMap.computeIfAbsent(id, k -> Pair.of(0.0f, 0)));

        return ratingMap;
    }

    private Map<Long, Integer> checkTotalFavoriteForRecipe(List<Long> recipeIds) {
        List<FavoriteRepository.RecipeLikeCount> counts = favoriteRepository.countLikesGroupByRecipeIdByRecipeIds(recipeIds);

        var totalFavoriteMap = counts.stream()
                .collect(Collectors.toMap(
                        FavoriteRepository.RecipeLikeCount::getRecipeId,
                        FavoriteRepository.RecipeLikeCount::getLikeCount
                ));
        recipeIds.forEach(id -> totalFavoriteMap.putIfAbsent(id, 0));

        return totalFavoriteMap;
    }

    private Map<String, Pair<String, String>> getAuthorInforMap(List<String> usernames) {
        List<User> users = userRepository.findByUsernameIn(usernames);
        return users.stream().collect(Collectors.toMap(User::getUsername, u -> Pair.of(u.getFullName(), u.getImgUrl())));
    }
}
