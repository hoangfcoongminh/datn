package com.edward.cook_craft.controller;

import com.edward.cook_craft.service.chatbot.ChatbotService;
import com.edward.cook_craft.service.chatbot.TrainingDataService;
import com.edward.cook_craft.utils.ResponseUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final TrainingDataService trainingDataService;

    @GetMapping("/training-data/export")
    public ResponseEntity<?> getData() {
        return ResponseUtils.handleSuccess(trainingDataService.exportTrainingData());
    }
}
