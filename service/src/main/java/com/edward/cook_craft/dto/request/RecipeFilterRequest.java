package com.edward.cook_craft.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecipeFilterRequest {

    private String keyword;
    private List<Long> categoryIds;
    private List<Long> ingredientIds;
    private List<String> authorUsernames;
    private Integer status;
}
