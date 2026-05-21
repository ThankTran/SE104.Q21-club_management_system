package com.example.demo.application.service.implement.document;

import com.example.demo.application.dto.request.document.DocumentStatusRequest;
import com.example.demo.application.dto.response.document.DocumentStatusResponse;
import com.example.demo.application.exception.BusinessException;
import com.example.demo.application.mapper.document.DocumentStatusMapper;
import com.example.demo.application.service.interfaces.document.DocumentStatusService;
import com.example.demo.domain.enums.DocumentStatus;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@CacheConfig(cacheNames = "documentStatuses")
public class DocumentStatusServiceImpl implements DocumentStatusService {
    private final DocumentStatusMapper documentStatusMapper;

    public DocumentStatusServiceImpl(DocumentStatusMapper documentStatusMapper) {
        this.documentStatusMapper = documentStatusMapper;
    }

    @Override
    @CacheEvict(allEntries = true)
    public DocumentStatusResponse create(DocumentStatusRequest request) {
        DocumentStatus status = documentStatusMapper.fromRequest(request);
        if (status == null) {
            throw new BusinessException("Không tìm thấy trạng thái tài liệu: " + request.getStatusName());
        }
        return documentStatusMapper.toResponse(status);
    }

    @Override
    @Cacheable(key = "'all'")
    public List<DocumentStatusResponse> getAll() {
        return List.of(DocumentStatus.values()).stream()
                .map(documentStatusMapper::toResponse)
                .toList();
    }

    @Override
    @Cacheable(key = "'name:' + #statusName")
    public DocumentStatusResponse getByName(String statusName) {
        DocumentStatus status = documentStatusMapper.fromName(statusName);
        if (status == null) {
            throw new BusinessException("Không tìm thấy trạng thái tài liệu: " + statusName);
        }
        return documentStatusMapper.toResponse(status);
    }

    @Override
    @Async("applicationTaskExecutor")
    public CompletableFuture<List<DocumentStatusResponse>> getAllAsync() {
        return CompletableFuture.completedFuture(getAll());
    }
}

