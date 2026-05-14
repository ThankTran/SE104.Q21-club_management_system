package com.example.demo.application.dto.request.notification;

import lombok.Data;

@Data
public class NotificationRequest {
    private String title;
    private String content;
    private Long senderId;
    private String targetType;
    private String sendMethod;
}
