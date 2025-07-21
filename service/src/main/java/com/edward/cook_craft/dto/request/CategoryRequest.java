package com.edward.cook_craft.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    private Long id;
    private String name;
    private String description;
}
