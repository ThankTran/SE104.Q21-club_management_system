package com.example.demo.application.service.auth.impl;

import com.example.demo.application.dto.request.user.CreateUserRequest;
import com.example.demo.application.dto.request.user.LoginRequest;
import com.example.demo.application.dto.response.auth.AuthResponse;
import com.example.demo.application.dto.response.user.UserResponse;
import com.example.demo.application.service.auth.interfaces.AuthService;
import com.example.demo.application.service.auth.interfaces.AuthTokenService;
import com.example.demo.application.service.user.interfaces.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    private final UserService userService;
    private final AuthTokenService authTokenService;

    public AuthServiceImpl(UserService userService, AuthTokenService authTokenService) {
        this.userService = userService;
        this.authTokenService = authTokenService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        UserResponse user = userService.login(request);
        return AuthResponse.builder()
                .user(user)
                .token(authTokenService.createToken(user.getUserId()))
                .build();
    }

    @Override
    public AuthResponse register(CreateUserRequest request) {
        UserResponse user = userService.createUser(request);
        return AuthResponse.builder()
                .user(user)
                .token(authTokenService.createToken(user.getUserId()))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String authorizationHeader) {
        Long userId = authTokenService.parseUserId(authorizationHeader);
        return userService.getUserById(userId);
    }
}
