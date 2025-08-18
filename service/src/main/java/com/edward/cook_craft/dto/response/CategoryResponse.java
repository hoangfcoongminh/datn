package com.edward.cook_craft.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class CategoryResponse extends BaseResponse {

    private Long id;
    private String name;
    private String imgUrl;
    private String description;
}
