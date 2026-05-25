package com.example.demo.application.service.auth.impl;

import com.example.demo.application.dto.request.user.CreateUserRequest;
import com.example.demo.application.dto.request.user.LoginRequest;
import com.example.demo.application.dto.response.auth.AuthResponse;
import com.example.demo.application.dto.response.user.UserResponse;
import com.example.demo.application.service.auth.interfaces.AuthService;
import com.example.demo.application.service.user.interfaces.UserService;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    private static final String TOKEN_PREFIX = "Bearer ";
    private static final String TOKEN_USER_PREFIX = "user:";

    private final UserService userService;

    public AuthServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        UserResponse user = userService.login(request);
        return AuthResponse.builder()
                .user(user)
                .token(createToken(user.getUserId()))
                .build();
    }

    @Override
    public AuthResponse register(CreateUserRequest request) {
        UserResponse user = userService.createUser(request);
        return AuthResponse.builder()
                .user(user)
                .token(createToken(user.getUserId()))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String authorizationHeader) {
        Long userId = parseUserId(authorizationHeader);
        return userService.getUserById(userId);
    }

    private String createToken(Long userId) {
        String payload = TOKEN_USER_PREFIX + userId;
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    }

    private Long parseUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(TOKEN_PREFIX)) {
            throw new IllegalArgumentException("Missing authorization token");
        }

        String token = authorizationHeader.substring(TOKEN_PREFIX.length());
        String payload;
        try {
            payload = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid authorization token");
        }

        if (!payload.startsWith(TOKEN_USER_PREFIX)) {
            throw new IllegalArgumentException("Invalid authorization token");
        }

        try {
            return Long.valueOf(payload.substring(TOKEN_USER_PREFIX.length()));
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Invalid authorization token");
        }
    }
}
