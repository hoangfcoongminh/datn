package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.response.NewsfeedResponse;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.RecipeRepository;
import com.edward.cook_craft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsfeedService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public NewsfeedResponse getParameterForNewsfeed() {
        NewsfeedResponse response = new NewsfeedResponse();
        response.setTotalUser(userRepository.findAll().size());
        response.setActiveUser(userRepository.findAllAndActive().size());
        response.setTotalRecipe(recipeRepository.findAll().size());
        response.setNewRecipeOfWeek(recipeRepository.findAllByCreatedAtAfter(LocalDateTime.now().with(DayOfWeek.MONDAY)
                .withHour(0).withMinute(0).withSecond(0).withNano(0)).size());

        return response;
    }
}
