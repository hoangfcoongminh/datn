package com.edward.cook_craft.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecipeFilterRequest {

    private String keyword;
    private List<Long> categoryIds;
    private List<Long> ingredientIds;
    private List<String> authorUsernames;
    private Integer status;
}
