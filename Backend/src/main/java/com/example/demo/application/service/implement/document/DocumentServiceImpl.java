package com.example.demo.application.service.implement.document;

import com.example.demo.application.dto.request.document.DocumentRequest;
import com.example.demo.application.dto.response.document.DocumentResponse;
import com.example.demo.application.exception.BusinessException;
import com.example.demo.application.mapper.document.DocumentMapper;
import com.example.demo.application.service.interfaces.document.DocumentService;
import com.example.demo.domain.model.document.Document;
import com.example.demo.domain.model.document.DocumentType;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.model.subject.Subject;
import com.example.demo.domain.repository.document.DocumentFileRepository;
import com.example.demo.domain.repository.document.DocumentRepository;
import com.example.demo.domain.repository.document.DocumentTypeRepository;
import com.example.demo.domain.repository.member.MemberRepository;
import com.example.demo.domain.repository.subject.SubjectRepository;
import com.example.demo.domain.service.document.DocumentDomainService;
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
@CacheConfig(cacheNames = "documents")
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final SubjectRepository subjectRepository;
    private final MemberRepository memberRepository;
    private final DocumentFileRepository documentFileRepository;
    private final DocumentMapper documentMapper;
    private final DocumentDomainService documentDomainService;

    public DocumentServiceImpl(
            DocumentRepository documentRepository,
            DocumentTypeRepository documentTypeRepository,
            SubjectRepository subjectRepository,
            MemberRepository memberRepository,
            DocumentFileRepository documentFileRepository,
            DocumentMapper documentMapper,
            DocumentDomainService documentDomainService) {
        this.documentRepository = documentRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.subjectRepository = subjectRepository;
        this.memberRepository = memberRepository;
        this.documentFileRepository = documentFileRepository;
        this.documentMapper = documentMapper;
        this.documentDomainService = documentDomainService;
    }

    @Override
    @CacheEvict(allEntries = true)
    public DocumentResponse create(DocumentRequest request) {
        documentDomainService.validateCreateRequest(request);
        documentDomainService.validateDocumentUniqueness(
                request.getDocumentName(),
                request.getSource(),
                request.getSource() != null
                        && !request.getSource().isBlank()
                        && documentRepository.existsByDocumentNameIgnoreCaseAndSourceIgnoreCase(
                                request.getDocumentName(),
                                request.getSource()));

        DocumentType type = documentTypeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new BusinessException("Khong tim thay loai tai lieu: " + request.getTypeId()));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new BusinessException("Khong tim thay chu de: " + request.getSubjectId()));
        Member proposedBy = memberRepository.findById(request.getProposedById())
                .orElseThrow(() -> new BusinessException("Khong tim thay thanh vien de xuat: " + request.getProposedById()));

        documentDomainService.validateProposer(proposedBy);

        Document document = documentMapper.toEntity(request, type, subject, proposedBy);
        return documentMapper.toResponse(documentRepository.save(document));
    }

    @Override
    @Cacheable(key = "'all'")
    public List<DocumentResponse> getAll() {
        return documentRepository.findAll().stream().map(documentMapper::toResponse).toList();
    }

    @Override
    @Cacheable(key = "'name:' + #documentName")
    public List<DocumentResponse> searchByName(String documentName) {
        return documentRepository.searchByName(documentName)
                .stream().map(documentMapper::toResponse).toList();
    }

    @Override
    @Cacheable(key = "'subject:' + #subjectId")
    public List<DocumentResponse> getBySubject(Integer subjectId) {
        return documentRepository.findBySubjectId(subjectId)
                .stream().map(documentMapper::toResponse).toList();
    }

    @Override
    @Cacheable(key = "'type:' + #typeId")
    public List<DocumentResponse> getByType(Integer typeId) {
        return documentRepository.findByTypeId(typeId)
                .stream().map(documentMapper::toResponse).toList();
    }

    @Override
    @Cacheable(key = "'id:' + #id")
    public DocumentResponse getById(Long id) {
        return documentRepository.findById(id)
                .map(documentMapper::toResponse)
                .orElseThrow(() -> new BusinessException("Khong tim thay document: " + id));
    }

    @Override
    @CacheEvict(allEntries = true)
    public void softDeleteById(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new BusinessException("Khong tim thay document: " + id);
        }
        documentRepository.softDeleteById(id);
    }

    @Override
    @CacheEvict(allEntries = true)
    public void hardDeleteById(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new BusinessException("Khong tim thay document: " + id);
        }
        if (documentFileRepository.existsByDocumentDocumentId(id)) {
            throw new BusinessException(
                    "Cannot delete document because it already has files. Please remove related document files first.");
        }
        documentRepository.deleteById(id);
    }

    @Override
    @Async("applicationTaskExecutor")
    public CompletableFuture<List<DocumentResponse>> getAllAsync() {
        return CompletableFuture.completedFuture(getAll());
    }

    @Override
    @Async("applicationTaskExecutor")
    public CompletableFuture<DocumentResponse> getByIdAsync(Long id) {
        return CompletableFuture.completedFuture(getById(id));
    }
}
