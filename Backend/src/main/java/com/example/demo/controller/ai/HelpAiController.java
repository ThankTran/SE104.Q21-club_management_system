package com.example.demo.controller.ai;

import com.example.demo.application.dto.request.ai.HelpAiRequest;
import com.example.demo.application.dto.response.ai.HelpAiResponse;
import com.example.demo.application.dto.response.user.UserResponse;
import com.example.demo.application.service.ai.interfaces.HelpAiService;
import com.example.demo.config.AccessControlInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/help")
@RequiredArgsConstructor
public class HelpAiController {
    private final HelpAiService helpAiService;

    @PostMapping
    public HelpAiResponse ask(
            @RequestBody HelpAiRequest request,
            @RequestAttribute(value = AccessControlInterceptor.CURRENT_USER_ATTRIBUTE, required = false)
            UserResponse currentUser) {
        return helpAiService.ask(request, currentUser);
    }
}
