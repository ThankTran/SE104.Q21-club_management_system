package com.example.demo.domain.service.notification;

import com.example.demo.application.dto.request.notification.NotificationRecipientRequest;

public interface NotificationRecipientDomainService {
    void validateCreateRequest(NotificationRecipientRequest request);

    void validateRecipientUniqueness(Long notificationId, Long memberId, boolean exists);

    void validateDelete(Long notificationId, Long memberId);
}
