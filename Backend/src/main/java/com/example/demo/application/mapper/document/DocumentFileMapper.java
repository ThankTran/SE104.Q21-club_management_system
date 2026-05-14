package com.example.demo.application.mapper.document;

import com.example.demo.application.dto.request.document.DocumentFileRequest;
import com.example.demo.application.dto.response.document.DocumentFileResponse;
import com.example.demo.domain.model.document.Document;
import com.example.demo.domain.model.document.DocumentFile;
import org.springframework.stereotype.Component;

@Component
public class DocumentFileMapper {
    public DocumentFile toEntity(DocumentFileRequest request, Document document) {
        return DocumentFile.builder()
                .document(document)
                .fileUrl(request.getFileUrl())
                .fileName(request.getFileName())
                .fileSize(request.getFileSize())
                .mimeType(request.getMimeType())
                .build();
    }

    public DocumentFileResponse toResponse(DocumentFile entity) {
        return DocumentFileResponse.builder()
                .fileId(entity.getFileId())
                .documentId(entity.getDocument() != null ? entity.getDocument().getDocumentId() : null)
                .fileUrl(entity.getFileUrl())
                .fileName(entity.getFileName())
                .fileSize(entity.getFileSize())
                .mimeType(entity.getMimeType())
                .uploadedAt(entity.getUploadedAt())
                .build();
    }
}

