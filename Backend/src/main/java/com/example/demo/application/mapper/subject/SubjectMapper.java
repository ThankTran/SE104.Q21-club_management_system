package com.example.demo.application.mapper.subject;

import com.example.demo.application.dto.request.subject.SubjectRequest;
import com.example.demo.application.dto.response.subject.SubjectResponse;
import com.example.demo.domain.model.subject.Subject;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapper {
    public Subject toEntity(SubjectRequest request) {
        return Subject.builder().subjectName(request.getSubjectName()).build();
    }

    public SubjectResponse toResponse(Subject entity) {
        return SubjectResponse.builder()
                .subjectId(entity.getSubjectId())
                .subjectName(entity.getSubjectName())
                .build();
    }
}

