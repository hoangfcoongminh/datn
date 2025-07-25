package com.edward.cook_craft.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class BlackListTokenService {

    private final RedisTemplate<String, Object> redisTemplate;

    public static final String BLACK_LIST_TOKEN = "black-list:";

    public void insertBlackListToken(String token, long ttlSeconds) {
        String key = BLACK_LIST_TOKEN + token;
        redisTemplate.opsForValue().set(key, "true");
        redisTemplate.expire(key, Duration.ofSeconds(ttlSeconds));
    }

    public boolean isBlackListToken(String token) {
        String key = BLACK_LIST_TOKEN + token;
        return redisTemplate.hasKey(key);
    }
}
