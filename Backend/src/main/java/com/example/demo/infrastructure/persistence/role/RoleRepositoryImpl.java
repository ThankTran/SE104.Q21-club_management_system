package com.example.demo.infrastructure.persistence.role;

import com.example.clubmanagement.domain.model.role.Role;
import com.example.clubmanagement.domain.repository.role.RoleRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RoleRepositoryImpl implements RoleRepository {

    private final RoleJpaRepository jpaRepository;

    @Override
    public Role save(Role role) {
        return jpaRepository.save(role);
    }

    @Override
    public Optional<Role> findById(Long roleId) {
        return jpaRepository.findById(roleId);
    }

    @Override
    public Optional<Role> findByRoleName(String roleName) {
        return jpaRepository.findByRoleName(roleName);
    }

    @Override
    public List<Role> findAll() {
        return jpaRepository.findAll();
    }
}