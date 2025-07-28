package com.edward.cook_craft.security;

import com.edward.cook_craft.dto.request.LoginRequest;
import com.edward.cook_craft.dto.request.SignupRequest;
import com.edward.cook_craft.dto.response.LoginResponse;
import com.edward.cook_craft.dto.response.UserResponse;
import com.edward.cook_craft.enums.Role;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.UserMapper;
import com.edward.cook_craft.model.CustomUserDetails;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailService customUserDetailService;
    private final JwtService jwtService;
    private final BlackListTokenService blackListTokenService;

    public LoginResponse login(LoginRequest request) {
        validateLogin(request);

        CustomUserDetails customUserDetails = (CustomUserDetails) customUserDetailService.loadUserByUsername(request.getUsername());
        String token = jwtService.generateAccessToken(customUserDetails);
        UserResponse userResponse = userMapper.toResponse(customUserDetails.getUser());

        return new LoginResponse(token, userResponse);
    }

    @Transactional
    public UserResponse signup(SignupRequest request) {
        validateSignup(request);

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setFullName(request.getFullName());
        newUser.setEmail(request.getEmail());
        newUser.setRole(Role.USER);

        newUser = userRepository.save(newUser);

        return userMapper.toResponse(newUser);
    }

    public String logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new CustomException("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        long expirationTimeMillis = jwtService.getExpirationMillis(token);
        blackListTokenService.insertBlackListToken(token, expirationTimeMillis);

        return "logout.successful";
    }

    private void validateSignup(SignupRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new CustomException("confirm.password.invalid");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CustomException("user.name.exists");
        }
    }

    private void validateLogin(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (Exception e) {
            throw new CustomException("invalid.username.password");
        }
    }
}
