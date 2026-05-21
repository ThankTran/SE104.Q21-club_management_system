package com.example.demo.domain.service.department;

import com.example.demo.application.dto.request.department.DepartmentRequest;

public interface DepartmentDomainService {
    void validateCreateRequest(DepartmentRequest request);

    void validateDepartmentUniqueness(String departmentName, boolean exists);

    void validateDelete(Long departmentId, boolean exists, boolean hasMembers);
}
