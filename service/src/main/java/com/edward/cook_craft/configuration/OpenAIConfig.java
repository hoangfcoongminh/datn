package com.edward.cook_craft.configuration;

import com.edward.cook_craft.exception.CustomException;
import com.theokanning.openai.service.OpenAiService;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class OpenAIConfig {

    @Bean
    public OpenAiService openAiService() {
        Dotenv dotenv = Dotenv.load();
        String apiKey = dotenv.get("OPENAI_API_KEY");

        if (apiKey == null || apiKey.isEmpty()) {
            throw new CustomException("chatbot.not.working.now");
        }

        return new OpenAiService(apiKey, Duration.ofSeconds(60));
    }
}
