package com.example.demo.application.dto.response.notification;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRecipientResponse {
    private Long notificationId;
    private Long memberId;
    private Boolean isRead;
    private LocalDateTime readAt;
}
