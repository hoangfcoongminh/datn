package com.edward.cook_craft.configuration;

import com.edward.cook_craft.utils.DateTimeUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.time.format.DateTimeFormatter;

@Configuration
public class JackSonConfig {

    private final ObjectMapper objectMapper;

    public JackSonConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void setUp() {
        JavaTimeModule module = new JavaTimeModule();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DateTimeUtils.DATE_TIME_FORMAT);

        // Apply formatting to LocalDateTime
        module.addSerializer(java.time.LocalDateTime.class,
                new com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer(formatter));
        module.addDeserializer(java.time.LocalDateTime.class,
                new com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer(formatter));

        objectMapper.registerModule(module);
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }
}
