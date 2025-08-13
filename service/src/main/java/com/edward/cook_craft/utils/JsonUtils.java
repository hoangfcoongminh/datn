package com.edward.cook_craft.utils;

import com.edward.cook_craft.exception.CustomException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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
            return mapper.readValue(object, clazz);
        } catch (JsonProcessingException e) {
            throw new CustomException("fail.to.parse.json");
        }
    }
}
