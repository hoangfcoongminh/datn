package com.edward.cook_craft.service;

import com.edward.cook_craft.model.CustomUserDetails;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    @Value("${jwt.refresh-token-expiration-ms}")
    private long refreshTokenExpirationMs;

    private SecretKey getSignKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(UserDetails userDetails) {
        return buildToken(userDetails, accessTokenExpirationMs,"access");
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(userDetails, refreshTokenExpirationMs,"refresh");
    }

    private String buildToken(UserDetails userDetails, long expirationMillis, String type) {
        CustomUserDetails customUser = (CustomUserDetails) userDetails;

        Map<String, Object> claims = new HashMap<>();
        claims.put("type", type);
        claims.put("userId", customUser.getId());
        claims.put("role", customUser.getUser().getRole().name());

        return Jwts.builder()
                .subject(customUser.getUsername())
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(getSignKey())
                .compact();
    }
}
