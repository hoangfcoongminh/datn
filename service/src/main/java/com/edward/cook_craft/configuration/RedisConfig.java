package com.edward.cook_craft.configuration;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean("redis-properties")
    @ConditionalOnMissingBean(name = "redis-properties")
    @ConfigurationProperties(prefix = "spring.redis-cook-craft")
    public RedisProperties redisProperties() {
        return new RedisProperties();
    }

    @Bean("redis-cook-craft-cache")
    @ConditionalOnMissingBean(name = "redis-cook-craft-cache")
    public JedisConnectionFactory jedisConnectionFactory(@Qualifier("redis-properties") RedisProperties redisProperties) {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setPort(redisProperties.getPort());
        redisStandaloneConfiguration.setHostName(redisProperties.getHost());
        redisStandaloneConfiguration.setDatabase(redisProperties.getDatabase());

        var clientBuilder = JedisClientConfiguration.builder();
        clientBuilder.connectTimeout(Duration.ofMillis(redisProperties.getTimeout()));
        clientBuilder.usePooling().poolConfig(redisProperties.getPool());

        return new  JedisConnectionFactory(redisStandaloneConfiguration, clientBuilder.build());
    }

    @Bean
    @Primary
    public RedisTemplate<String, Object> redisTemplate(@Qualifier("redis-cook-craft-cache") RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();

        redisTemplate.setConnectionFactory(redisConnectionFactory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());

        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        return redisTemplate;
    }
}
