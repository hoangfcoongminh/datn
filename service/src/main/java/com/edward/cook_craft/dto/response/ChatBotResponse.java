package com.edward.cook_craft.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatBotResponse {

    private List<String> ingredients;
    private List<String> steps;
    private String notes;
}
