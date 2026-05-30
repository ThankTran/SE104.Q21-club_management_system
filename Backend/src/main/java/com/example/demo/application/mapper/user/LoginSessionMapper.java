package com.example.demo.application.mapper.user;

import com.example.demo.application.dto.response.user.LoginSessionResponse;
import com.example.demo.domain.model.user.LoginSession;
import org.springframework.stereotype.Component;

@Component
public class LoginSessionMapper {
    public LoginSessionResponse toResponse(LoginSession session) {
        return LoginSessionResponse.builder()
                .sessionId(session.getSessionId())
                .userId(session.getUser().getUserId())
                .loginAt(session.getLoginAt())
                .ipAddress(session.getIpAddress())
                .userAgent(session.getUserAgent())
                .deviceLabel(session.getDeviceLabel())
                .build();
    }
}
