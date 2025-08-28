package com.edward.cook_craft.service.admin.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IngredientResponse {

    private Long id;

    private Long unitId;

    private String name;

    private String description;

    private String imgUrl;

    private Integer status;
}
