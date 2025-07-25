package com.edward.cook_craft.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
@Valid
public class SignupRequest {

    @NotBlank(message = "{username.required}")
    private String username;

    @NotBlank(message = "{password.required}")
    @Size(min = 6)
    private String password;

    @NotBlank(message = "{confirm.password.required}")
    private String confirmPassword;

    private String fullName;

    @Email(message = "{email.invalid}")
    private String email;
}
