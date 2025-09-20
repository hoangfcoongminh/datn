package com.edward.cook_craft.service.chatbot;

import com.edward.cook_craft.dto.request.ChatRequest;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatBotService {

    private final OpenAiService openAiService;

    public String getReply(ChatRequest chatRequest){
        String message = chatRequest.getMessage();
        int maxTokens = calculateMaxTokens(message);

        ChatMessage systemMessage = new ChatMessage("system",
                "Bạn là một trợ lý ảo chuyên về nấu ăn. " +
                        "Chỉ trả lời các câu hỏi liên quan đến nấu ăn, công thức, nguyên liệu, đơn vị của nguyên liệu trong công thức đó, danh mục của món ăn đó, mẹo bếp núc, dụng cụ nhà bếp. " +
                        "Nếu người dùng hỏi ngoài lĩnh vực này (chào hỏi, tạm biệt, giới thiệu bản thân thì có thể), hãy lịch sự từ chối và trả lời: " +
                        "\"Xin lỗi, tôi chỉ có thể trả lời các câu hỏi liên quan đến nấu ăn.\""
        );

        ChatMessage userMessage = new ChatMessage("user", message);

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-4o-mini")
                .messages(List.of(systemMessage, userMessage))
                .maxTokens(maxTokens)
                .build();

        ChatCompletionResult result = openAiService.createChatCompletion(request);
        return result.getChoices().get(0).getMessage().getContent();
    }

    private int calculateMaxTokens(String message) {
        int wordCount = message.trim().split("\\s+").length;
        if (wordCount <= 20) return 200;
        if (wordCount <= 50) return 500;
        return 800;
    }
}
