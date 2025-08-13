package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.response.UserResponse;
import com.edward.cook_craft.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User request) {
        return UserResponse.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .description(request.getDescription())
                .imgUrl(request.getImgUrl())
                .role(request.getRole())
                .build();
    }
}
