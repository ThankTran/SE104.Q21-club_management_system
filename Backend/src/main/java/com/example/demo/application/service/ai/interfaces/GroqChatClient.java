package com.example.demo.application.service.ai.interfaces;

public interface GroqChatClient {
    String complete(String systemPrompt, String userMessage);
}
