package com.edward.cook_craft.service;

import com.edward.cook_craft.constants.Constants;
import com.edward.cook_craft.dto.request.RecipeFilterRequest;
import com.edward.cook_craft.dto.request.UpdateUserRequest;
import com.edward.cook_craft.dto.response.RecipeResponse;
import com.edward.cook_craft.dto.response.UserFavoritesResponse;
import com.edward.cook_craft.dto.response.UserResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.UserMapper;
import com.edward.cook_craft.model.Favorite;
import com.edward.cook_craft.model.Review;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.FavoriteRepository;
import com.edward.cook_craft.repository.RecipeRepository;
import com.edward.cook_craft.repository.ReviewRepository;
import com.edward.cook_craft.repository.UserRepository;
import com.edward.cook_craft.service.minio.MinioService;
import com.edward.cook_craft.utils.CommonUtils;
import com.edward.cook_craft.utils.JsonUtils;
import com.edward.cook_craft.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final MinioService minioService;
    private final FavoriteRepository favoriteRepository;
    private final RecipeService recipeService;
    private final ReviewRepository reviewRepository;
    private final RecipeRepository recipeRepository;

    public UserResponse profile() {
        User user = SecurityUtils.getCurrentUser();
        if (user == null) {
            throw new CustomException("not.authenticated");
        }
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse update(String jsonRequest, MultipartFile file) {
        UpdateUserRequest request = JsonUtils.jsonMapper(jsonRequest, UpdateUserRequest.class);
        validate(request);

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new CustomException("user.not.found"));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        if (file != null && !file.isEmpty()) {
            String existsAvtUrl = user.getImgUrl();
            minioService.deleteFile(existsAvtUrl);
            user.setImgUrl(minioService.uploadFile(file, Constants.FILE_TYPE_IMAGE));
        }
        user.setDescription(request.getDescription());

        user = userRepository.save(user);

        return userMapper.toResponse(user);
    }

    private void validate(UpdateUserRequest request) {
        if (request.getEmail() != null && !CommonUtils.isValidEmail(request.getEmail())) {
            throw new CustomException("email.invalid");
        }
    }

    @Transactional
    public UserFavoritesResponse addRecipeFavorite(Long recipeId) {
        User userNow = SecurityUtils.getCurrentUser();
        if (userNow == null) {
            throw new CustomException("not.authenticated");
        }

        try {
            Optional<Favorite> checkExists = favoriteRepository.findByUserIdAndRecipeId(userNow.getId(), recipeId);
            if (checkExists.isPresent()) {
                Favorite favorite = checkExists.get();
                if (EntityStatus.ACTIVE.getStatus().equals(favorite.getStatus())) {
                    favorite.setStatus(EntityStatus.IN_ACTIVE.getStatus());
                } else {
                    favorite.setStatus(EntityStatus.ACTIVE.getStatus());
                }
                favoriteRepository.save(favorite); // lưu thay đổi
            } else {
                Favorite favorite = new Favorite();
                favorite.setUserId(userNow.getId());
                favorite.setRecipeId(recipeId);
                favorite.setStatus(EntityStatus.ACTIVE.getStatus()); // cần set status ban đầu
                favoriteRepository.save(favorite);
            }
        } catch (Exception e) {
            throw new CustomException("fail.to.add.favorite");
        }

        List<Long> favoriteRecipeIds = favoriteRepository.findAllFavoriteByUserId(userNow.getId())
                .stream()
                .map(Favorite::getRecipeId)
                .toList();

        return UserFavoritesResponse.builder()
                .userId(userNow.getId())
                .username(userNow.getUsername())
                .recipeIds(favoriteRecipeIds)
                .build();
    }


    public Page<RecipeResponse> getMyRecipes(RecipeFilterRequest request, Pageable pageable) {
        User user = SecurityUtils.getCurrentUser();
        if (user == null) {
            throw new CustomException("user.not.found");
        }
        request.setAuthorUsernames(List.of(user.getUsername()));
        return recipeService.filter(request, pageable);
    }

    public UserResponse getUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new CustomException("user.not.found");
        }
        UserResponse response = userMapper.toResponse(user.get());
        response.setTotalReviewForUser(getTotalReviewForUser(username));
        response.setAverageRating(getAverageRatingForUser(username));
        response.setTotalFavoriteForUser(getTotalFavoriteForUser(username));
        return response;
    }

    private List<Review> getAllReviewForUser(String username) {
        return reviewRepository.findAllReviewForUser(username);
    }

    private int getTotalReviewForUser(String username) {
        return getAllReviewForUser(username).size();
    }

    private float getAverageRatingForUser(String username) {
        float total = getAllReviewForUser(username)
                .stream()
                .map(Review::getRating)
                .reduce(0f, Float::sum);
        if (getTotalReviewForUser(username) == 0)
            return 0f;
        return total / getTotalReviewForUser(username);
    }

    private int getTotalFavoriteForUser(String username) {
        return favoriteRepository.findTotalFavoriteForUser(username).size();
    }

    public List<UserResponse> getPopular(String type) {
        List<UserResponse> response = new ArrayList<>();
        List<User> users = userRepository.findAllAndActive();
        String defaultType = "review";
        if (defaultType.equalsIgnoreCase(type)) {
            response = reviewRepository.findTopUsersByRating(PageRequest.of(0, 3));
        } else {
            response = favoriteRepository.findTopUsersByFavorite(PageRequest.of(0, 3));
        }
        return response;
    }
}
