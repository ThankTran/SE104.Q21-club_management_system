package com.example.demo.domain.service.document;

import com.example.demo.application.dto.request.document.DocumentRequest;
import com.example.demo.domain.model.member.Member;

public interface DocumentDomainService {
    void validateCreateRequest(DocumentRequest request);

    void validateDocumentUniqueness(String documentName, String source, boolean exists);

    void validateProposer(Member proposedBy);
}
