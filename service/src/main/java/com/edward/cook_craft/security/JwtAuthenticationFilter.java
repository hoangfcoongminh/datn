package com.edward.cook_craft.security;

import com.edward.cook_craft.exception.CustomAuthenticException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final BlackListTokenService blackListTokenService;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomUserDetailService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().equals("/api/auth/refresh")) {
            filterChain.doFilter(request,response);
            return;
        }
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request,response);
            return;
        }

        String token = authorizationHeader.substring(7);

        if (blackListTokenService.isBlackListToken(token)) {
            authenticationEntryPoint.commence(request, response, new CustomAuthenticException("token.expired"));
        }
        try {
            final String username = jwtService.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException ex) {
            authenticationEntryPoint.commence(request, response, new CustomAuthenticException("auth.token.expired"));
        } catch (MalformedJwtException ex) {
            authenticationEntryPoint.commence(request, response, new CustomAuthenticException("auth.token.invalid"));
        } catch (SignatureException ex) {
            authenticationEntryPoint.commence(request, response, new CustomAuthenticException("auth.token.signature.invalid"));
        } catch (Exception ex) {
//            throw ex;
            authenticationEntryPoint.commence(request, response, new CustomAuthenticException("auth.authenticate.fail"));
        }
    }
}
