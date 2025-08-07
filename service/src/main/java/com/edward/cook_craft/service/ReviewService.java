package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.ReviewRequest;
import com.edward.cook_craft.dto.response.PagedResponse;
import com.edward.cook_craft.dto.response.ReviewResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.PageMapper;
import com.edward.cook_craft.mapper.ReviewMapper;
import com.edward.cook_craft.model.Review;
import com.edward.cook_craft.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final PageMapper pageMapper;

    @Transactional
    public ReviewResponse comment(ReviewRequest request) {
        Optional<Review> comment = reviewRepository.findByUserIdAndRecipeId(request.getUserId(), request.getRecipeId());
        if (comment.isPresent()) {
            throw new CustomException("already.review");
        }
        Review review = reviewMapper.of(request);
        review.setId(null);

        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse updateComment(ReviewRequest request) {
        Optional<Review> comment = reviewRepository.findByUserIdAndRecipeId(request.getUserId(), request.getRecipeId());
        if (comment.isEmpty()) {
            throw new CustomException("comment.not.found");
        }
        Review r = comment.get();
        r.setRating(request.getRating());
        r.setComment(request.getComment());
        r.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus() : request.getStatus());

        return reviewMapper.toResponse(reviewRepository.save(r));
    }

    public PagedResponse<?> getReviewByRecipeId(Long recipeId, Pageable pageable) {
        Pageable page = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        Page<Review> data = reviewRepository.findByRecipeId(recipeId, page);

        return pageMapper.map(data, reviewMapper::toResponse);
    }
}
