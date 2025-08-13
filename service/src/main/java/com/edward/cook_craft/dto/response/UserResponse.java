package com.edward.cook_craft.dto.response;

import com.edward.cook_craft.enums.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {

    private String username;
    private String password;
    private String email;
    private String fullName;
    private String imgUrl;
    private Role role;
}
