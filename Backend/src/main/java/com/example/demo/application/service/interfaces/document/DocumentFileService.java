package com.example.demo.application.service.interfaces.document;

import com.example.demo.application.dto.request.document.DocumentFileRequest;
import com.example.demo.application.dto.response.document.DocumentFileResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface DocumentFileService {

    DocumentFileResponse create(DocumentFileRequest request);

    List<DocumentFileResponse> getByDocumentId(Long documentId);

    void delete(Long fileId);

    CompletableFuture<List<DocumentFileResponse>> getByDocumentIdAsync(Long documentId);
}

