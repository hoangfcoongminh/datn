package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.ReviewRequest;
import com.edward.cook_craft.dto.response.ReviewResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.ReviewMapper;
import com.edward.cook_craft.model.Review;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.ReviewRepository;
import com.edward.cook_craft.repository.UserRepository;
import com.edward.cook_craft.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse comment(ReviewRequest request) {
        User user = SecurityUtils.getCurrentUser();
        if (user == null) {
            throw new CustomException("not.authenticated");
        }
        Long userId = user.getId();
        Optional<Review> comment = reviewRepository.findByUserIdAndRecipeId(userId, request.getRecipeId());
        if (comment.isPresent()) {
            throw new CustomException("already.review");
        }
        Review review = reviewMapper.of(request);
        review.setId(null);
        review.setUserId(userId);
        review.setUsername(user.getUsername());

        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse updateComment(ReviewRequest request) {
        User user = SecurityUtils.getCurrentUser();
        if (user == null) {
            throw new CustomException("not.authenticated");
        }
        Long userId = user.getId();
        Optional<Review> comment = reviewRepository.findByUserIdAndRecipeId(userId, request.getRecipeId());
        if (comment.isEmpty()) {
            throw new CustomException("comment.not.found");
        }
        Review r = comment.get();
        r.setRating(request.getRating());
        r.setComment(request.getComment());
        r.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus() : request.getStatus());

        return reviewMapper.toResponse(reviewRepository.save(r));
    }

    public Page<ReviewResponse> getReviewByRecipeId(Long recipeId, Pageable pageable) {
        Pageable page = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        Page<Review> pageData = reviewRepository.findByRecipeId(recipeId, page);
        List<ReviewResponse> data = pageData.getContent().stream()
                .map(reviewMapper::toResponse).toList();

        List<String> usernames = data.stream().map(ReviewResponse::getUsername).toList();
        Map<String, User> avtUserMap = userRepository.findByUsernameIn(usernames).stream()
                .collect(Collectors.toMap(User::getUsername, i -> i));

        data.forEach(r -> {
            r.setImgUrl(avtUserMap.get(r.getUsername()).getImgUrl());
            r.setFullName(avtUserMap.get(r.getUsername()).getFullName());
        });

        return new PageImpl<>(data, pageable, pageData.getTotalElements());
    }
}
