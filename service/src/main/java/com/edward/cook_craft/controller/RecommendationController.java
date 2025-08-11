package com.edward.cook_craft.controller;

import com.edward.cook_craft.service.recommend.PersonalRecommendationService;
import com.edward.cook_craft.service.recommend.RelatedRecommendationService;
import com.edward.cook_craft.utils.ResponseUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class RecommendationController {

    private final PersonalRecommendationService personalRecommendationService;
    private final RelatedRecommendationService relatedRecommendationService;

    @GetMapping("/user")
    public ResponseEntity<?> getRecommendationsByUser(
            @RequestParam Long userId
    ) {
        return ResponseUtils.handleSuccess(personalRecommendationService.getRecommendationsForUser(userId));
    }

    @GetMapping("/recipe")
    public ResponseEntity<?> getRecommendationsByRecipe(
            @RequestParam Long recipeId
    ) {
        return ResponseUtils.handleSuccess(relatedRecommendationService.getRelatedRecipes(recipeId));
    }
}
