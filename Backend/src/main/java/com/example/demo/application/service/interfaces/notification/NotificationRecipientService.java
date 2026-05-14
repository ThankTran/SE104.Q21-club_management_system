package com.example.demo.application.service.interfaces.notification;

import com.example.demo.application.dto.request.notification.NotificationRecipientRequest;
import com.example.demo.application.dto.response.notification.NotificationRecipientResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface NotificationRecipientService {
    NotificationRecipientResponse create(NotificationRecipientRequest request);

    List<NotificationRecipientResponse> getByNotification(Long notificationId);

    List<NotificationRecipientResponse> getByMember(Long memberId);

    void delete(Long notificationId, Long memberId);

    CompletableFuture<List<NotificationRecipientResponse>> getByMemberAsync(Long memberId);
}
