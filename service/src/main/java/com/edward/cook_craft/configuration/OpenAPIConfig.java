package com.edward.cook_craft.configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "COOK CRAFT API", // Tiêu đề của API
                version = "1.0", // Phiên bản API của bạn
                description = "This is a COOK CRAFT API" // Mô tả chung về API
        )
)
@Configuration
public class OpenAPIConfig {
}
