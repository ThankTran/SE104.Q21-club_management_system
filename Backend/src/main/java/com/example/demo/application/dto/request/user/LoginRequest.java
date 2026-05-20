package com.example.demo.application.dto.request.user;

import lombok.Data;

@Data
public class LoginRequest {
    private Long userId;
    private Long memberId;
    private String password;
}
