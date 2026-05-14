package com.example.demo.application.mapper.department;

import com.example.demo.application.dto.request.department.DepartmentRequest;
import com.example.demo.application.dto.response.department.DepartmentResponse;
import com.example.demo.domain.model.department.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    public Department toEntity(DepartmentRequest request) {
        return Department.builder()
                .departmentName(request.getDepartmentName())
                .build();
    }

    public DepartmentResponse toResponse(Department entity) {
        return DepartmentResponse.builder()
                .departmentId(entity.getDepartmentId())
                .departmentName(entity.getDepartmentName())
                .build();
    }
}
