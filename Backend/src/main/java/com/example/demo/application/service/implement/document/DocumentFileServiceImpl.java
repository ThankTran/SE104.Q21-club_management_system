package com.example.demo.application.service.implement.document;

import com.example.demo.application.dto.request.document.DocumentFileRequest;
import com.example.demo.application.dto.response.document.DocumentFileResponse;
import com.example.demo.application.mapper.document.DocumentFileMapper;
import com.example.demo.application.service.interfaces.document.DocumentFileService;
import com.example.demo.domain.model.document.Document;
import com.example.demo.domain.repository.document.DocumentFileRepository;
import com.example.demo.domain.repository.document.DocumentRepository;
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
@CacheConfig(cacheNames = "documentFiles")
public class DocumentFileServiceImpl implements DocumentFileService {
    private final DocumentFileRepository documentFileRepository;
    private final DocumentRepository documentRepository;
    private final DocumentFileMapper documentFileMapper;

    public DocumentFileServiceImpl(
            DocumentFileRepository documentFileRepository,
            DocumentRepository documentRepository,
            DocumentFileMapper documentFileMapper) {
        this.documentFileRepository = documentFileRepository;
        this.documentRepository = documentRepository;
        this.documentFileMapper = documentFileMapper;
    }

    @Override
    @CacheEvict(
            key = "'document:' + #request.documentId",
            condition = "#request != null && #request.documentId != null")
    public DocumentFileResponse create(DocumentFileRequest request) {
        Document document = documentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài liệu: " + request.getDocumentId()));
        return documentFileMapper.toResponse(
                documentFileRepository.save(documentFileMapper.toEntity(request, document)));
    }

    @Override
    @Cacheable(key = "'document:' + #documentId")
    public List<DocumentFileResponse> getByDocumentId(Long documentId) {
        return documentFileRepository.findByDocumentDocumentId(documentId).stream()
                .map(documentFileMapper::toResponse)
                .toList();
    }

    @Override
    @CacheEvict(allEntries = true)
    public void delete(Long fileId) {
        documentFileRepository.deleteById(fileId);
    }

    @Override
    @Async("applicationTaskExecutor")
    public CompletableFuture<List<DocumentFileResponse>> getByDocumentIdAsync(Long documentId) {
        return CompletableFuture.completedFuture(getByDocumentId(documentId));
    }
}

