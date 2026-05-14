package com.example.demo.domain.repository.department;

import com.example.demo.domain.model.department.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByDepartmentName(String departmentName);

    boolean existsByDepartmentNameIgnoreCase(String departmentName);
}
