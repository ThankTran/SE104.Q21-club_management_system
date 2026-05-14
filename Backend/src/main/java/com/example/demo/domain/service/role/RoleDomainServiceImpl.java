package com.example.demo.domain.service.role;

import com.example.demo.application.dto.request.role.RoleRequest;
import org.springframework.stereotype.Service;

@Service
public class RoleDomainServiceImpl implements RoleDomainService {
    @Override
    public void validateCreateRequest(RoleRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Role request must not be empty");
        }
        if (request.getRoleName() == null || request.getRoleName().isBlank()) {
            throw new IllegalArgumentException("Role name must not be empty");
        }
        if (request.getPriority() == null || request.getPriority() < 1) {
            throw new IllegalArgumentException("Role priority must be greater than zero");
        }
    }

    @Override
    public void validateRoleUniqueness(String roleName, boolean exists) {
        if (exists) {
            throw new IllegalArgumentException("Role already exists: " + roleName);
        }
    }

    @Override
    public void validateDelete(Long roleId, boolean exists, boolean hasMembers) {
        if (!exists) {
            throw new IllegalArgumentException("Role not found: " + roleId);
        }
        if (hasMembers) {
            throw new IllegalArgumentException("Cannot delete role because members still use it.");
        }
    }
}
