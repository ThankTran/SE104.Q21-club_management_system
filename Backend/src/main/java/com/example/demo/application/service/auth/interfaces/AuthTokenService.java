package com.example.demo.application.service.auth.interfaces;

public interface AuthTokenService {
    String createToken(Long userId);

    Long parseUserId(String authorizationHeader);
}
