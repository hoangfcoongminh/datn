package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.ReviewRequest;
import com.edward.cook_craft.service.ReviewService;
import com.edward.cook_craft.utils.ResponseUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping()
    public ResponseEntity<?> comment(
            @RequestBody ReviewRequest request
    ) {
        return ResponseUtils.handleSuccess(reviewService.comment(request));
    }

    @PutMapping()
    public ResponseEntity<?> updateComment(
            @RequestBody ReviewRequest request
    ) {
        return ResponseUtils.handleSuccess(reviewService.updateComment(request));
    }

    @GetMapping("/recipe/{id}")
    public ResponseEntity<?> getReviews(
            @PathVariable Long id,
            Pageable pageable
    ) {
        return ResponseUtils.handleSuccess(reviewService.getReviewByRecipeId(id, pageable));
    }
}
