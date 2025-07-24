package com.edward.cook_craft.configuration;

import lombok.Getter;
import lombok.Setter;
import redis.clients.jedis.JedisPoolConfig;

@Getter
@Setter
public class RedisProperties {

    private int port;
    private String host;
    private int timeout;
    private int database;

    private JedisPoolConfig pool;
}
