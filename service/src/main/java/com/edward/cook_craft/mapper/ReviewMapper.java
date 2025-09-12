package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.request.ReviewRequest;
import com.edward.cook_craft.dto.response.ReviewResponse;
import com.edward.cook_craft.model.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public Review of(ReviewRequest request) {
        return Review.builder()
                .recipeId(request.getRecipeId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
    }

    public ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUserId())
                .username(review.getUsername())
                .recipeId(review.getRecipeId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .createdBy(review.getCreatedBy())
                .build();
    }
}
