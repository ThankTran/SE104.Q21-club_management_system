package com.example.demo.application.mapper.document;

import com.example.demo.application.dto.request.document.DocumentTypeRequest;
import com.example.demo.application.dto.response.document.DocumentTypeResponse;
import com.example.demo.domain.model.document.DocumentType;
import org.springframework.stereotype.Component;

@Component
public class DocumentTypeMapper {

    public DocumentType toEntity(DocumentTypeRequest request) {
        return DocumentType.builder()
                .typeName(request.getTypeName())
                .build();
    }

    public DocumentTypeResponse toResponse(DocumentType entity) {
        return DocumentTypeResponse.builder()
                .typeId(entity.getTypeId())
                .typeName(entity.getTypeName())
                .build();
    }
}
