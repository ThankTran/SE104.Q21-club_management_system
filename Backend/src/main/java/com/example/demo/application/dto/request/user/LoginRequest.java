package com.example.demo.application.dto.request.user;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private Long userId;
    private Long memberId;
    private String password;
}
