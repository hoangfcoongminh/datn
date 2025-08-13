package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.LoginRequest;
import com.edward.cook_craft.dto.request.SignupRequest;
import com.edward.cook_craft.security.AuthenticService;
import com.edward.cook_craft.utils.ResponseUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/authentic")
@RequiredArgsConstructor
@Tag(name = "Authentic", description = "Authentic API")
public class AuthenticController {

    private final AuthenticService service;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest loginRequest
    ) {
        return ResponseUtils.handleSuccess(service.login(loginRequest));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody @Valid SignupRequest request
    ) {
        return ResponseUtils.handleSuccess(service.signup(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
        HttpServletRequest request
    ) {
        return ResponseUtils.handleSuccess(service.logout(request));
    }
}
