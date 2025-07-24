package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.SignupRequest;
import com.edward.cook_craft.service.AuthenticService;
import com.edward.cook_craft.utils.ResponseUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/authentic/")
@RequiredArgsConstructor
public class AuthenticController {

    private final AuthenticService service;

    @PostMapping
    public ResponseEntity<?> signup(
            @RequestBody @Valid SignupRequest request
    ) {
        return ResponseUtils.handleSuccess(service.signup(request));
    }
}
