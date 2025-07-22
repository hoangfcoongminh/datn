package com.edward.cook_craft.utils;

import com.edward.cook_craft.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;

public final class ResponseUtils {

    public static <T> ResponseEntity<?> handleSuccess(T data) {
        return  ResponseEntity.ok(ApiResponse.success(data));
    }

//    public static <T> ResponseEntity<?> handleFailure(T data) {
//        return ResponseEntity.ok(ApiResponse.failure())
//    }
}
