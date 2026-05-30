package com.example.demo.application.service.ai.interfaces;

import com.example.demo.application.dto.request.ai.HelpAiRequest;
import com.example.demo.application.dto.response.ai.HelpAiResponse;
import com.example.demo.application.dto.response.user.UserResponse;

public interface HelpAiService {
    HelpAiResponse ask(HelpAiRequest request, UserResponse currentUser);
}
