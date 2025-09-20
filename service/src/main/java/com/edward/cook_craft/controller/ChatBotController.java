package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.ChatRequest;
import com.edward.cook_craft.service.chatbot.ChatBotService;
import com.edward.cook_craft.utils.ResponseUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/chatbot")
@RestController
@RequiredArgsConstructor
public class ChatBotController {

    private final ChatBotService chatBotService;

    @PostMapping
    public ResponseEntity<?> getReply(
            @Valid @RequestBody ChatRequest chatRequest
    ) {
        return ResponseUtils.handleSuccess(chatBotService.getReply(chatRequest));
    }
}
