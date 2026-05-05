package com.example.demo.domain.repository.role;

import com.example.demo.domain.model.role.Role;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoleRepository {
    Role save(Role role);

    Optional<Role> findById(Long roleId);

    Optional<Role> findByRoleName(String roleName);

    List<Role> findAll();

}