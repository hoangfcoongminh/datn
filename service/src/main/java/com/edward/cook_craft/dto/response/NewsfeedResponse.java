package com.edward.cook_craft.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewsfeedResponse {

    private int totalUser;
    private int activeUser;
    private int totalRecipe;
    private int newRecipeOfWeek;
}
