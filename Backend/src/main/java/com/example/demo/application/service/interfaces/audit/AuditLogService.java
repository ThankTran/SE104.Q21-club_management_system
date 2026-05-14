package com.example.demo.application.service.interfaces.audit;

import com.example.demo.application.dto.request.audit.AuditLogRequest;
import com.example.demo.application.dto.response.audit.AuditLogResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface AuditLogService {
    AuditLogResponse create(AuditLogRequest request);

    List<AuditLogResponse> getAll();

    AuditLogResponse getById(Long id);

    List<AuditLogResponse> getByEntityType(String entityType);

    List<AuditLogResponse> getByActionType(String actionType);

    CompletableFuture<List<AuditLogResponse>> getAllAsync();

    CompletableFuture<AuditLogResponse> getByIdAsync(Long id);
}
