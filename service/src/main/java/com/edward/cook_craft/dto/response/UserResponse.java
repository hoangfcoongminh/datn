package com.edward.cook_craft.dto.response;

import com.edward.cook_craft.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserResponse {

    private String username;
    private String email;
    private String fullName;
    private String description;
    private String imgUrl;
    private Role role;
    private Integer status;
    private int totalReviewForUser;
    private float averageRating;
    private int totalFavoriteForUser;

    public UserResponse(String username,
                        String email,
                        String fullName,
                        String description,
                        String imgUrl,
                        Role role,
                        Long totalReviewForUser,
                        Double averageRating,
                        Long totalFavoriteForUser) {
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.description = description;
        this.imgUrl = imgUrl;
        this.role = role;
        this.totalReviewForUser = totalReviewForUser != null ? totalReviewForUser.intValue() : 0;
        this.averageRating = averageRating != null ? averageRating.floatValue() : 0f;
        this.totalFavoriteForUser = totalFavoriteForUser != null ? totalFavoriteForUser.intValue() : 0;
    }

    public UserResponse(String username,
                        String email,
                        String fullName,
                        String description,
                        String imgUrl,
                        Role role,
                        Integer totalRecipe,         // COUNT(DISTINCT r.id)
                        Integer averageRating,    // ở query bạn đang cho hẳn 0
                        Long totalFavoriteForUser) { // SUM(fCount)
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.description = description;
        this.imgUrl = imgUrl;
        this.role = role;
        this.totalReviewForUser = totalRecipe != null ? totalRecipe.intValue() : 0;
        this.averageRating = averageRating != null ? averageRating.floatValue() : 0f;
        this.totalFavoriteForUser = totalFavoriteForUser != null ? totalFavoriteForUser.intValue() : 0;
    }
}
