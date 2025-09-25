package com.edward.cook_craft.service.admin.dto.request;

import com.edward.cook_craft.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddUserReq {

    private String username;
    private String password;
    private String fullName;
    private Role role;
}
