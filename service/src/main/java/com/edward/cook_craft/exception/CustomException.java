package com.edward.cook_craft.exception;

public class CustomException extends RuntimeException {

    private final Integer status;

    public CustomException(String message) {
        super(message);
        this.status = 400; // default Bad Request
    }

    public CustomException(String message, int status) {
        super(message);
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}
