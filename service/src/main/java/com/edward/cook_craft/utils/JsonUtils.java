package com.edward.cook_craft.utils;

import com.edward.cook_craft.exception.CustomException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class JsonUtils {

    private static final ObjectMapper mapper;

    static {
        mapper = new ObjectMapper();
    }

    public static String marshal(Object object) throws JsonProcessingException {
        return mapper.writeValueAsString(object);
    }

    public static <T> T jsonMapper(String object, Class<T> clazz) {
        try {
            log.info("JSON: {}", object);
            return mapper.readValue(object, clazz);
        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
            throw new CustomException("fail.to.parse.json");
        }
    }
}
