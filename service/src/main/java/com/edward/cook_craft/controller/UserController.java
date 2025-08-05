package com.edward.cook_craft.controller;

import com.edward.cook_craft.service.UserService;
import com.edward.cook_craft.utils.ResponseUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(
            @PathVariable Long id
    ) {
        return ResponseUtils.handleSuccess(userService.details(id));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestPart(name = "jsonRequest") String jsonRequest,
            @RequestPart(name = "img", required = false) MultipartFile file
    ) {
        return ResponseUtils.handleSuccess(userService.update(jsonRequest, file));
    }
}
