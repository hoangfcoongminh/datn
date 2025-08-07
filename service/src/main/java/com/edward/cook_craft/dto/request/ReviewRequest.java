package com.edward.cook_craft.dto.request;

import com.edward.cook_craft.enums.EntityStatus;
import lombok.Getter;

@Getter
public class ReviewRequest {

    private Long userId;
    private String username;
    private Long recipeId;
    private Float rating;
    private String comment;
    private Integer status;
}
