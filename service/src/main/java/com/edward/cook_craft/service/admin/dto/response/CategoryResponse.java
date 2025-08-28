package com.edward.cook_craft.service.admin.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryResponse {

    private Long id;

    private String name;

    private String imgUrl;

    private String description;

    private Integer status;
}
