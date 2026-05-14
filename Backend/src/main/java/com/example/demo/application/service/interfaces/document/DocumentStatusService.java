package com.example.demo.application.service.interfaces.document;

import com.example.demo.application.dto.request.document.DocumentStatusRequest;
import com.example.demo.application.dto.response.document.DocumentStatusResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface DocumentStatusService {

    DocumentStatusResponse create(DocumentStatusRequest request);

    List<DocumentStatusResponse> getAll();

    DocumentStatusResponse getByName(String statusName);

    CompletableFuture<List<DocumentStatusResponse>> getAllAsync();
}

