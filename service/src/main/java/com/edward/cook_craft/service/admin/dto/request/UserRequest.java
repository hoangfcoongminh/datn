package com.edward.cook_craft.service.admin.dto.request;

import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {

    String search;
    EntityStatus status;
    Role role;
}
