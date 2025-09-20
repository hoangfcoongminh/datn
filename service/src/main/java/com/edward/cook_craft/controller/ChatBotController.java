package com.edward.cook_craft.controller;

import com.edward.cook_craft.dto.request.ChatRequest;
import com.edward.cook_craft.service.chatbot.ChatBotService;
import com.edward.cook_craft.service.chatbot.ChatHistoryService;
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
    private final ChatHistoryService chatHistoryService;

    @PostMapping
    public ResponseEntity<?> getReply(
            @Valid @RequestBody ChatRequest chatRequest
    ) {
        return ResponseUtils.handleSuccess(chatBotService.getReply(chatRequest));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
    ) {
        return ResponseUtils.handleSuccess(chatHistoryService.getHistory());
    }
}
