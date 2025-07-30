package com.edward.cook_craft.dto.request;

import lombok.Getter;

import java.util.List;

@Getter
public class RecipeFilterRequest {

    private String keyword;
    private List<Long> categoryIds;
    private List<Long> ingredientIds;
    private List<String> authorUsernames;
}
