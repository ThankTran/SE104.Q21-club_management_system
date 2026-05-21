package com.example.demo.application.mapper.audit;

import com.example.demo.application.dto.request.audit.AuditLogRequest;
import com.example.demo.application.dto.response.audit.AuditLogResponse;
import com.example.demo.domain.model.audit.AuditLog;
import com.example.demo.domain.model.member.Member;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLog toEntity(AuditLogRequest request, Member performedBy) {
        return AuditLog.builder()
                .entityType(request.getEntityType())
                .entityId(request.getEntityId())
                .actionType(request.getActionType())
                .oldValue(request.getOldValue())
                .newValue(request.getNewValue())
                .performedBy(performedBy)
                .build();
    }

    public AuditLogResponse toResponse(AuditLog entity) {
        Long performedById = entity.getPerformedBy() == null ? null : entity.getPerformedBy().getMemberId();
        return AuditLogResponse.builder()
                .logId(entity.getLogId())
                .entityType(entity.getEntityType())
                .entityId(entity.getEntityId())
                .actionType(entity.getActionType())
                .oldValue(entity.getOldValue())
                .newValue(entity.getNewValue())
                .performedById(performedById)
                .performedAt(entity.getPerformedAt())
                .build();
    }
}
