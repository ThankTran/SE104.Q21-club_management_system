package com.example.demo.application.mapper.notification;

import com.example.demo.application.dto.request.notification.NotificationRequest;
import com.example.demo.application.dto.response.notification.NotificationResponse;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.model.notification.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public Notification toEntity(NotificationRequest request, Member sender) {
        return Notification.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .sender(sender)
                .targetType(request.getTargetType())
                .sendMethod(request.getSendMethod())
                .build();
    }

    public NotificationResponse toResponse(Notification entity) {
        Long senderId = entity.getSender() == null ? null : entity.getSender().getMemberId();
        return NotificationResponse.builder()
                .notificationId(entity.getNotificationId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .senderId(senderId)
                .targetType(entity.getTargetType())
                .sendMethod(entity.getSendMethod())
                .sentAt(entity.getSentAt())
                .build();
    }
}
