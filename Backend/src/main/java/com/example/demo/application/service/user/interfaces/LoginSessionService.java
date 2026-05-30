package com.example.demo.application.service.user.interfaces;

import com.example.demo.application.dto.response.user.LoginSessionResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

public interface LoginSessionService {
    void recordLogin(Long userId, HttpServletRequest request);

    List<LoginSessionResponse> getSessionsByUser(Long userId);
}
