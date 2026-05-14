package com.example.demo.application.dto.response.document;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DocumentFileResponse {
    private Long fileId;
    private Long documentId;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private LocalDateTime uploadedAt;
}

