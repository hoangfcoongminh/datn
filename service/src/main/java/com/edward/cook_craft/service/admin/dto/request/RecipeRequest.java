package com.edward.cook_craft.service.admin.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecipeRequest {

    private String search;
    private List<Long> categoryIds;
    private List<String> authorUsernames;
    private Integer status;
}
