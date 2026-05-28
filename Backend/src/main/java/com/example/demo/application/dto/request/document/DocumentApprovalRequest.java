package com.example.demo.application.dto.request.document;

import com.example.demo.domain.enums.ApprovalStatusEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentApprovalRequest {
    @NotNull(message = "Document id is required")
    private Long documentId;

    @NotNull(message = "Approver is required")
    private Long approvedBy;

    @NotNull(message = "Approval status is required")
    private ApprovalStatusEnum status;

    private String note;

    private String lookupFolderId;
}
