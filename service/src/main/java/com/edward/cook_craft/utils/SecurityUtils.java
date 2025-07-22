package com.edward.cook_craft.utils;

import com.edward.cook_craft.model.CustomUserDetails;
import com.edward.cook_craft.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class SecurityUtils {

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return Optional.ofNullable(authentication.getPrincipal())
                .map(principal -> (CustomUserDetails) principal)
                .map(CustomUserDetails::getUser)
                .orElse(null);
    }
}
