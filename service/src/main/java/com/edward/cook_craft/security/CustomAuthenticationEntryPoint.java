package com.edward.cook_craft.security;

import com.edward.cook_craft.dto.response.ApiResponse;
import com.edward.cook_craft.utils.JsonUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final MessageSource messageSource;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");

        int errorCode = 401;
        int statusCode = HttpStatus.UNAUTHORIZED.value();
        String messageKey = authException.getMessage();

        if ("auth.token.invalid".equalsIgnoreCase(messageKey)) {
            errorCode = 498;
            statusCode = 498;
        }
        if ("auth.token.expired".equalsIgnoreCase(messageKey)) {
            errorCode = 40101;
        }
        if ("auth.token.signature.invalid".equalsIgnoreCase(messageKey)) {
            errorCode = 40102;
        }
        String localizedMessage = messageSource.getMessage(
                messageKey, null, "Not authenticated!", LocaleContextHolder.getLocale()
        );
        var base = ApiResponse.builder()
                .success(false)
                .code(errorCode)
                .title(authException.getMessage())
                .message(localizedMessage)
                .build();
        response.getWriter().write(JsonUtils.marshal(base));
    }


}
