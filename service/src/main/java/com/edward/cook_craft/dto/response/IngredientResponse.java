package com.edward.cook_craft.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class IngredientResponse extends BaseResponse {

    private Long id;
    private Long unitId;
    private String name;
    private String description;
    private String imgUrl;
}
