package com.example.demo.application.mapper.notification;

import com.example.demo.application.dto.request.notification.NotificationRecipientRequest;
import com.example.demo.application.dto.response.notification.NotificationRecipientResponse;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.model.notification.Notification;
import com.example.demo.domain.model.notification.NotificationRecipient;
import com.example.demo.domain.model.notification.NotificationRecipientId;
import org.springframework.stereotype.Component;

@Component
public class NotificationRecipientMapper {

    public NotificationRecipient toEntity(
            NotificationRecipientRequest request,
            Notification notification,
            Member member) {
        NotificationRecipientId id = new NotificationRecipientId(request.getNotificationId(), request.getMemberId());
        return NotificationRecipient.builder()
                .id(id)
                .notification(notification)
                .member(member)
                .isRead(request.getIsRead() != null ? request.getIsRead() : Boolean.FALSE)
                .readAt(request.getReadAt())
                .build();
    }

    public NotificationRecipientResponse toResponse(NotificationRecipient entity) {
        Long notificationId = entity.getId() != null ? entity.getId().getNotificationId() : null;
        Long memberId = entity.getId() != null ? entity.getId().getMemberId() : null;
        return NotificationRecipientResponse.builder()
                .notificationId(notificationId)
                .memberId(memberId)
                .isRead(entity.getIsRead())
                .readAt(entity.getReadAt())
                .build();
    }
}
