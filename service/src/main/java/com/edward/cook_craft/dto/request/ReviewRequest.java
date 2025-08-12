package com.edward.cook_craft.dto.request;

import lombok.Getter;

@Getter
public class ReviewRequest {

    private Long recipeId;
    private Float rating;
    private String comment;
    private Integer status;
}
