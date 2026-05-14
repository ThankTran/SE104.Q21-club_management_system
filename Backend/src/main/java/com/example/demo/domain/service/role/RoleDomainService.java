package com.example.demo.domain.service.role;

import com.example.demo.application.dto.request.role.RoleRequest;

public interface RoleDomainService {
    void validateCreateRequest(RoleRequest request);

    void validateRoleUniqueness(String roleName, boolean exists);

    void validateDelete(Long roleId, boolean exists, boolean hasMembers);
}
