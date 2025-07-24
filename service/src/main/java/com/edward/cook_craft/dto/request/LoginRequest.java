package com.edward.cook_craft.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginRequest {

    @NotBlank(message = "username.is.required")
    private String username;

    @NotBlank(message = "password.is.required")
    private String password;
}
