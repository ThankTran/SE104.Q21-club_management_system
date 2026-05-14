package com.example.demo.application.service.interfaces.subject;

import com.example.demo.application.dto.request.subject.SubjectRequest;
import com.example.demo.application.dto.response.subject.SubjectResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface SubjectService {
    SubjectResponse create(SubjectRequest request);

    List<SubjectResponse> getAll();

    SubjectResponse getById(Integer id);

    void delete(Integer id);

    CompletableFuture<List<SubjectResponse>> getAllAsync();
}
