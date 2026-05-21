package com.example.demo.application.service.interfaces.document;

import com.example.demo.application.dto.request.document.DocumentTypeRequest;
import com.example.demo.application.dto.response.document.DocumentTypeResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface DocumentTypeService {

    DocumentTypeResponse create(DocumentTypeRequest request);

    List<DocumentTypeResponse> getAll();

    DocumentTypeResponse getByName(String typeName);

    CompletableFuture<List<DocumentTypeResponse>> getAllAsync();
}

