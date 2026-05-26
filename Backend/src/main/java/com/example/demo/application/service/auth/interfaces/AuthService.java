package com.example.demo.application.service.auth.interfaces;

import com.example.demo.application.dto.request.user.CreateUserRequest;
import com.example.demo.application.dto.request.user.LoginRequest;
import com.example.demo.application.dto.response.auth.AuthResponse;
import com.example.demo.application.dto.response.user.UserResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);

    AuthResponse register(CreateUserRequest request);

    UserResponse getCurrentUser(String authorizationHeader);
}
