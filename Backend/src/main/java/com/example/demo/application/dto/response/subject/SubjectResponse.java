package com.example.demo.application.dto.response.subject;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubjectResponse {
    private Integer subjectId;
    private String subjectName;
}

