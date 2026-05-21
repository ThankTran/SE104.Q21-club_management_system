package com.example.demo.application.dto.request.notification;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class NotificationRecipientRequest {
    private Long notificationId;
    private Long memberId;
    private Boolean isRead;
    private LocalDateTime readAt;
}
