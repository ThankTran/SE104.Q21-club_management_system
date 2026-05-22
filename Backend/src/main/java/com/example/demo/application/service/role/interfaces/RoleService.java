package com.example.demo.application.service.role.interfaces;

import com.example.demo.application.dto.request.role.RoleRequest;
import com.example.demo.application.dto.response.role.RoleResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface RoleService {
    RoleResponse create(RoleRequest request);

    List<RoleResponse> getAll();

    RoleResponse getById(Long id);

    RoleResponse getByRoleName(String roleName);

    void delete(Long id);

    CompletableFuture<List<RoleResponse>> getAllAsync();

    CompletableFuture<RoleResponse> getByIdAsync(Long id);
}
