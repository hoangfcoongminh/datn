package com.edward.cook_craft.controller;

import com.edward.cook_craft.service.NewsfeedService;
import com.edward.cook_craft.utils.ResponseUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/newsfeed")
@RequiredArgsConstructor
public class NewsfeedController {

    private final NewsfeedService newsfeedService;

    @GetMapping
    public ResponseEntity<?> getParameterForNewsfeed() {
        return ResponseUtils.handleSuccess(newsfeedService.getParameterForNewsfeed());
    }
}
