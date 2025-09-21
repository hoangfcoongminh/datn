package com.edward.cook_craft.service.chatbot;

import com.edward.cook_craft.dto.ChatMessageDTO;
import com.edward.cook_craft.utils.SecurityUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatHistoryService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final int MAX_HISTORY = 200; // tối đa 200 tin nhắn/ngày/người
    private static final Duration TTL = Duration.ofDays(1); // chỉ giữ 1 ngày
    private final ObjectMapper mapper = new ObjectMapper();

    private String keyForUser(String key) {
        String today = LocalDate.now().toString();
        return "chat:history:" + key + ":" + today;
    }

    /** Lưu message mới vào Redis */
    public void saveMessage(String key, String sender, Object content) {
        ChatMessageDTO msg = new ChatMessageDTO(sender, content, LocalDate.now().toString());
        String k = keyForUser(key);

        try {
            String json = mapper.writeValueAsString(msg);
            redisTemplate.opsForList().rightPush(k, json);
            redisTemplate.opsForList().trim(k, -200, -1);
            redisTemplate.expire(k, Duration.ofDays(1));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Cannot serialize chat message", e);
        }
    }

    /** Lấy toàn bộ lịch sử chat trong ngày */
    public List<ChatMessageDTO> getHistory() {
        String username = SecurityUtils.getCurrentUsername();
        String key = keyForUser(username);
        List<Object> raw = redisTemplate.opsForList().range(key, 0, -1);
        if (raw == null) return List.of();
        return raw.stream()
                .map(o -> {
                    try {
                        return mapper.readValue(o.toString(), ChatMessageDTO.class);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
    }
}
