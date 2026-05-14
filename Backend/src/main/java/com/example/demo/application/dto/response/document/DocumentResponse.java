package com.example.demo.application.dto.response.document;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DocumentResponse {
    private Long documentId;
    private String documentName;
    private Integer typeId;
    private String typeName;
    private Integer subjectId;
    private String subjectName;
    private String status;
    private String reqStatus;
    private String version;
    private String source;
    private String note;
    private Long proposedById;
    private Long approvedById;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

