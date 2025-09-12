package com.edward.cook_craft.service.admin.dto.response;

import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private String username;
    private String email;
    private String fullName;
    private String description;
    private String imgUrl;
    private Role role;
    private Integer status;
}
