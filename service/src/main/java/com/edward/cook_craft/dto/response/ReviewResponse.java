package com.edward.cook_craft.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class ReviewResponse extends BaseResponse {

    private Long id;
    private Long userId;
    private String username;
    private Long recipeId;
    private Float rating;
    private String comment;
}
