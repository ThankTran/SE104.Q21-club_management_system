package com.example.demo.domain.service.notification;

import com.example.demo.application.dto.request.notification.NotificationRecipientRequest;
import org.springframework.stereotype.Service;

@Service
public class NotificationRecipientDomainServiceImpl implements NotificationRecipientDomainService {
    @Override
    public void validateCreateRequest(NotificationRecipientRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Notification recipient request must not be empty");
        }
        if (request.getNotificationId() == null) {
            throw new IllegalArgumentException("Notification ID must not be empty");
        }
        if (request.getMemberId() == null) {
            throw new IllegalArgumentException("Member ID must not be empty");
        }
    }

    @Override
    public void validateRecipientUniqueness(Long notificationId, Long memberId, boolean exists) {
        if (exists) {
            throw new IllegalArgumentException(
                    "Member " + memberId + " already belongs to notification " + notificationId);
        }
    }

    @Override
    public void validateDelete(Long notificationId, Long memberId) {
        if (notificationId == null) {
            throw new IllegalArgumentException("Notification ID must not be empty");
        }
        if (memberId == null) {
            throw new IllegalArgumentException("Member ID must not be empty");
        }
    }
}
