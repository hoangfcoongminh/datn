package com.edward.cook_craft.dto.response;

import com.edward.cook_craft.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupResponse {

    private String username;
    private String password;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
}
