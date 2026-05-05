package com.example.demo.infrastructure.persistence.department;

import com.example.clubmanagement.domain.model.department.Department;
import com.example.clubmanagement.domain.repository.department.DepartmentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DepartmentRepositoryImpl implements DepartmentRepository {

    private final DepartmentJpaRepository jpaRepository;

    @Override
    public Department save(Department department) {
        return jpaRepository.save(department);
    }

    @Override
    public Optional<Department> findById(Long departmentId) {
        return jpaRepository.findById(departmentId);
    }

    @Override
    public Optional<Department> findByName(String name) {
        return jpaRepository.findByDepartmentName(name);
    }

    @Override
    public List<Department> findAll() {
        return jpaRepository.findAll();
    }
}