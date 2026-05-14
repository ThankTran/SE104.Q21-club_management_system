package com.example.demo.application.mapper.document;

import com.example.demo.domain.enums.DocumentStatus;
import com.example.demo.application.dto.request.document.DocumentStatusRequest;
import com.example.demo.application.dto.response.document.DocumentStatusResponse;
import org.springframework.stereotype.Component;

@Component
public class DocumentStatusMapper {

    public DocumentStatusResponse toResponse(DocumentStatus status) {
        // statusId is derived from enum ordinal to keep response contract stable.
        return DocumentStatusResponse.builder()
                .statusId(status.ordinal() + 1)
                .statusName(status.getLabel())
                .build();
    }

    public DocumentStatus fromRequest(DocumentStatusRequest request) {
        String raw = request.getStatusName();
        if (raw == null) {
            return null;
        }

        String normalized = raw.trim();
        if (normalized.isEmpty()) {
            return null;
        }

        // Support both enum names (WORKING, FIXING, CANCELLED) and labels (Đang hoạt động, ...).
        try {
            return DocumentStatus.valueOf(normalized.toUpperCase());
        } catch (IllegalArgumentException ignored) {
            // fall through to label matching
        }

        for (DocumentStatus status : DocumentStatus.values()) {
            if (status.getLabel().equalsIgnoreCase(normalized)) {
                return status;
            }
        }

        return null;
    }

    public DocumentStatus fromName(String statusName) {
        if (statusName == null) {
            return null;
        }
        // Reuse the same normalization logic.
        DocumentStatusRequest request = new DocumentStatusRequest();
        request.setStatusName(statusName);
        return fromRequest(request);
    }
}
