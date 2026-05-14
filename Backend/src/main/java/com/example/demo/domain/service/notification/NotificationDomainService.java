package com.example.demo.domain.service.notification;

import com.example.demo.application.dto.request.notification.NotificationRequest;
import com.example.demo.domain.model.member.Member;

public interface NotificationDomainService {
    void validateCreateRequest(NotificationRequest request);

    void validateSender(Member sender);
}
