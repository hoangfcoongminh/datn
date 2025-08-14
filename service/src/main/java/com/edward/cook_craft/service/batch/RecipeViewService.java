package com.edward.cook_craft.service.batch;

import com.edward.cook_craft.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecipeViewService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RecipeRepository recipeRepository;

    public void increaseView(Long recipeId) {
//        log.info("Increase view count for recipe {}", recipeId);
        String key = "recipe:view:" + recipeId;
        redisTemplate.opsForValue().increment(key);
    }

    @Scheduled(cron = "0 * * * * *") //every minute
    @Transactional
    public void flushViewsToDb() {
//        log.info("Flush views to DB");
        Set<String> keys = redisTemplate.keys("recipe:view:*");
        if (keys.isEmpty()) return;

        for (String key : keys) {
            Long recipeId = Long.valueOf(key.split(":")[2]);
            Number viewsObj = (Number) redisTemplate.opsForValue().get(key);
            if (viewsObj != null) {
                Long views = convertToLong(viewsObj);
                if (views > 0) {
                    recipeRepository.incrementViewCount(recipeId, views);
                    redisTemplate.delete(key);
                }
            }
        }
    }

    private Long convertToLong(Object value) {
        if (value instanceof Long) {
            return (Long) value;
        } else if (value instanceof Integer) {
            return ((Integer) value).longValue();
        } else if (value instanceof Number) {
            return ((Number) value).longValue();
        } else {
            return Long.valueOf(value.toString());
        }
    }
}
