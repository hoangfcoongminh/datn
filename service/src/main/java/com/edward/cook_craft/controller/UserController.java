package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.RecipeFilterRequest;
import com.edward.cook_craft.service.RecipeService;
import com.edward.cook_craft.service.UserService;
import com.edward.cook_craft.utils.ResponseUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RecipeService recipeService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        return ResponseUtils.handleSuccess(userService.profile());
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestPart(name = "jsonRequest") String jsonRequest,
            @RequestPart(name = "img", required = false) MultipartFile file
    ) {
        return ResponseUtils.handleSuccess(userService.update(jsonRequest, file));
    }

    @PostMapping("/favorite/{id}")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long id
    ) {
        return ResponseUtils.handleSuccess(userService.addRecipeFavorite(id));
    }

    @PostMapping("/my/recipes")
    public ResponseEntity<?> getMyRecipes(
            @RequestBody RecipeFilterRequest request,
            Pageable pageable
    ) {
        return ResponseUtils.handleSuccess(userService.getMyRecipes(request, pageable));
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUser(
            @PathVariable String username
    ) {
        return ResponseUtils.handleSuccess(userService.getUser(username));
    }

    @GetMapping("/popular-by/{type}")
    public ResponseEntity<?> getPopularByType(
            @PathVariable String type
    ) {
        return ResponseUtils.handleSuccess(userService.getPopular(type));
    }
}
