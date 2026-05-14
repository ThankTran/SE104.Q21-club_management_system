package com.example.demo.application.mapper.event;

import com.example.demo.application.dto.request.event.EventRoleRequest;
import com.example.demo.application.dto.response.event.EventRoleResponse;
import com.example.demo.domain.model.event.EventRole;
import org.springframework.stereotype.Component;

@Component
public class EventRoleMapper {

    public EventRole toEntity(EventRoleRequest request) {
        return EventRole.builder()
                .roleId(request.getRoleId())
                .roleName(request.getRoleName())
                .build();
    }

    public EventRoleResponse toResponse(EventRole entity) {
        return EventRoleResponse.builder()
                .roleId(entity.getRoleId())
                .roleName(entity.getRoleName())
                .build();
    }
}
