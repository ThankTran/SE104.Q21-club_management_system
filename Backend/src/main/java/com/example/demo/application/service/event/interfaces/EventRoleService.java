package com.example.demo.application.service.event.interfaces;

import com.example.demo.application.dto.request.event.EventRoleRequest;
import com.example.demo.application.dto.response.event.EventRoleResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface EventRoleService {
    EventRoleResponse create(EventRoleRequest request);

    List<EventRoleResponse> getAll();

    EventRoleResponse getByName(String roleName);

    CompletableFuture<List<EventRoleResponse>> getAllAsync();
}
