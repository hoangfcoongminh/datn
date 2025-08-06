package com.edward.cook_craft.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException {

    private String title;
    private String messageKey;
    private final int status;

    public CustomException(String messageKey) {
        super(messageKey);
        this.messageKey = messageKey;
        this.status = HttpStatus.INTERNAL_SERVER_ERROR.value();
    }

    public CustomException(String messageKey, int status) {
        super(messageKey);
        this.messageKey = messageKey;
        this.status = status;
    }

}
