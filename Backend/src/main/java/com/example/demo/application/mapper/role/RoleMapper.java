package com.example.demo.application.mapper.role;

import com.example.demo.application.dto.request.role.RoleRequest;
import com.example.demo.application.dto.response.role.RoleResponse;
import com.example.demo.domain.model.role.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public Role toEntity(RoleRequest request) {
        return Role.builder()
                .roleName(request.getRoleName())
                .priority(request.getPriority())
                .build();
    }

    public RoleResponse toResponse(Role entity) {
        return RoleResponse.builder()
                .roleId(entity.getRoleId())
                .roleName(entity.getRoleName())
                .priority(entity.getPriority())
                .build();
    }
}
