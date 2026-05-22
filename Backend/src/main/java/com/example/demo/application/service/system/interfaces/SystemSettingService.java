package com.example.demo.application.service.system.interfaces;

import com.example.demo.application.dto.request.system.SystemSettingRequest;
import com.example.demo.application.dto.response.system.SystemSettingResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface SystemSettingService {
    SystemSettingResponse createOrUpdate(SystemSettingRequest request);

    List<SystemSettingResponse> getAll();

    List<SystemSettingResponse> searchByKey(String key);

    SystemSettingResponse getByKey(String key);

    void delete(String key);

    CompletableFuture<SystemSettingResponse> getByKeyAsync(String key);
}
