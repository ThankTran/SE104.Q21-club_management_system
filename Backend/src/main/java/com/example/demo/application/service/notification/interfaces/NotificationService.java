package com.example.demo.application.service.notification.interfaces;

import com.example.demo.application.dto.request.notification.NotificationRequest;
import com.example.demo.application.dto.response.notification.NotificationResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface NotificationService {
    NotificationResponse create(NotificationRequest request);

    List<NotificationResponse> getAll();

    List<NotificationResponse> searchByTitle(String title);

    List<NotificationResponse> getByTargetType(String targetType);

    NotificationResponse getById(Long id);

    void delete(Long id);

    CompletableFuture<List<NotificationResponse>> getAllAsync();
}
