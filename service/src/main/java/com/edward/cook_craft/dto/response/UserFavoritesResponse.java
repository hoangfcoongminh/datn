package com.edward.cook_craft.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class UserFavoritesResponse {

    private Long userId;
    private String username;
    private List<Long> recipeIds;
}
