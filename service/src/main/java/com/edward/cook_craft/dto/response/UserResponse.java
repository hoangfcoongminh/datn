package com.edward.cook_craft.dto.response;

import com.edward.cook_craft.enums.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {

    private String username;
    private String email;
    private String fullName;
    private String description;
    private String imgUrl;
    private Role role;
    private int totalReviewForUser;
    private float averageRating;
    private int totalFavoriteForUser;
}
