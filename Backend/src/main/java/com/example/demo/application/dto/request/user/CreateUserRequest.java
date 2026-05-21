package com.example.demo.application.dto.request.user;

import lombok.Data;

@Data
public class CreateUserRequest {
    private Long memberId;
    private String password;
}
