package com.example.demo.application.service.department.interfaces;

import com.example.demo.application.dto.request.department.DepartmentRequest;
import com.example.demo.application.dto.response.department.DepartmentResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface DepartmentService {
    DepartmentResponse create(DepartmentRequest request);

    List<DepartmentResponse> getAll();

    DepartmentResponse getById(Long id);

    DepartmentResponse getByDepartmentName(String departmentName);

    void delete(Long id);

    CompletableFuture<List<DepartmentResponse>> getAllAsync();

    CompletableFuture<DepartmentResponse> getByIdAsync(Long id);
}
