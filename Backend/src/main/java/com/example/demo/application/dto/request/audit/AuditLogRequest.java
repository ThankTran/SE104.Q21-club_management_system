package com.example.demo.application.dto.request.audit;

import lombok.Data;

@Data
public class AuditLogRequest {
    private String entityType;
    private String entityId;
    private String actionType;
    private String oldValue;
    private String newValue;
    private Long performedById;
}
