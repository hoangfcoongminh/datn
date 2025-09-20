package com.edward.cook_craft.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequest {

    @NotBlank(message = "Message không được để trống")
    @Size(max = 500, message = "Message không được vượt quá 500 ký tự")
    private String message;
}
