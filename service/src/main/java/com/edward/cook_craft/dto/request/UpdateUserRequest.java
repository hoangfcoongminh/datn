package com.edward.cook_craft.dto.request;

import com.edward.cook_craft.enums.Role;
import lombok.Getter;

@Getter
public class UpdateUserRequest {

    private String username;
    private String password;
    private String email;
    private String fullName;
    private Role role;
}
