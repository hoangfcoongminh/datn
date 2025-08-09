package com.edward.cook_craft.controller;

import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public List<Recipe> getRecommendations(
            @RequestParam Long userId
    ) {
        return recommendationService.getRecommendationsForUser(userId);
    }
}
