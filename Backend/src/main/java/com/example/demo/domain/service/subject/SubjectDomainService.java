package com.example.demo.domain.service.subject;

import com.example.demo.application.dto.request.subject.SubjectRequest;

public interface SubjectDomainService {
    void validateCreateRequest(SubjectRequest request);

    void validateUpdateRequest(Integer subjectId, SubjectRequest request);

    void validateSubjectUniqueness(String subjectName, boolean exists);

    void validateDelete(Integer subjectId, boolean exists, boolean hasDocuments);
}
