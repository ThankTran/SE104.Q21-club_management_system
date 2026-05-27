package com.example.demo.application.service.subject.interfaces;

import com.example.demo.application.dto.request.subject.SubjectRequest;
import com.example.demo.application.dto.response.subject.SubjectResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface SubjectService {
    SubjectResponse create(SubjectRequest request);

    List<SubjectResponse> getAll();

    SubjectResponse getById(Integer id);

    SubjectResponse update(Integer id, SubjectRequest request);

    void delete(Integer id);

    CompletableFuture<List<SubjectResponse>> getAllAsync();
}
