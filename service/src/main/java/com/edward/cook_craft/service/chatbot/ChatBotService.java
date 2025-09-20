package com.edward.cook_craft.service.chatbot;

import com.edward.cook_craft.dto.request.ChatRequest;
import com.edward.cook_craft.dto.response.ChatBotResponse;
import com.edward.cook_craft.utils.JsonUtils;
import com.edward.cook_craft.utils.SecurityUtils;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatBotService {

    private final OpenAiService openAiService;
    private final ChatHistoryService chatHistoryService;

    public ChatBotResponse getReply(ChatRequest chatRequest){
        String message = chatRequest.getMessage();
        String key = SecurityUtils.getCurrentUsername();
        chatHistoryService.saveMessage(key, "user", message);

        int maxTokens = calculateMaxTokens(message);

        ChatMessage systemMessage = new ChatMessage("system",
                "Bạn là một trợ lý ảo chuyên về nấu ăn. " +
                        "Bạn cần trả lời các câu hỏi về công thức, nguyên liệu, mẹo thay thế, dụng cụ nhà bếp và cách chế biến. " +
                        "Bạn chỉ từ chối nếu câu hỏi hoàn toàn KHÔNG liên quan đến nấu ăn. " +
                        "Khi trả lời, luôn xuất JSON với cấu trúc: " +
                        "{ \"ingredients\": [\"...\"], \"steps\": [\"...\"], \"notes\": \"...\" }. " +
                        "Nếu không cần nguyên liệu hoặc bước nấu, hãy để mảng rỗng và dùng notes để giải thích. " +
                        "Đảm bảo escape ký tự đặc biệt trong chuỗi (ví dụ dấu \" phải thành \\\")." +
                        "Không thêm bất kỳ văn bản nào ngoài JSON."
        );

        ChatMessage userMessage = new ChatMessage("user", message);

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-4o-mini")
                .messages(List.of(systemMessage, userMessage))
                .maxTokens(maxTokens)
                .build();

        ChatCompletionResult result = openAiService.createChatCompletion(request);
        String json = result.getChoices().get(0).getMessage().getContent();

        ChatBotResponse response = JsonUtils.jsonMapper(json, ChatBotResponse.class);
        chatHistoryService.saveMessage(key, "chatbot", response);

        return response;
    }

    private int calculateMaxTokens(String message) {
        int wordCount = message.trim().split("\\s+").length;
        if (wordCount <= 20) return 500;
        if (wordCount <= 50) return 800;
        return 1000;
    }
}
