package com.example.demo.domain.repository.department;

import com.example.demo.domain.model.department.Department;
import java.util.Optional;
import org.springframework.stereotype.Repository;
importt java.util.List;

@Repository
public interface DepartmentRepository {
    Department save(Department department);

    Optional<Department> findById(Long departmentId);

    Optional<Department> findByName(String name);

    List<Department> findAll();

}