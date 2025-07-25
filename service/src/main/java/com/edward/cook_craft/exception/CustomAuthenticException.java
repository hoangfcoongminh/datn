package com.edward.cook_craft.exception;

import org.springframework.security.core.AuthenticationException;

public class CustomAuthenticException extends AuthenticationException {
    public CustomAuthenticException(String message) {
        super(message);
    }
}
