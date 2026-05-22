package com.example.demo.application.service.finance.impl;

import com.example.demo.application.dto.request.finance.TransactionRequest;
import com.example.demo.application.dto.response.finance.TransactionResponse;
import com.example.demo.application.mapper.finance.TransactionMapper;
import com.example.demo.domain.enums.TransactionType;
import com.example.demo.domain.model.finance.Transaction;
import com.example.demo.domain.repository.event.EventRepository;
import com.example.demo.domain.repository.finance.TransactionRepository;
import com.example.demo.domain.repository.member.MemberRepository;
import com.example.demo.domain.service.finance.TransactionDomainService;
import java.time.LocalDateTime;
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
@CacheConfig(cacheNames = "transactions")
public class TransactionServiceImpl implements com.example.demo.application.service.finance.interfaces.TransactionService {
    private final TransactionRepository transactionRepository;
    private final EventRepository eventRepository;
    private final MemberRepository memberRepository;
    private final TransactionMapper transactionMapper;
    private final TransactionDomainService transactionDomainService;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            EventRepository eventRepository,
            MemberRepository memberRepository,
            TransactionMapper transactionMapper,
            TransactionDomainService transactionDomainService) {
        this.transactionRepository = transactionRepository;
        this.eventRepository = eventRepository;
        this.memberRepository = memberRepository;
        this.transactionMapper = transactionMapper;
        this.transactionDomainService = transactionDomainService;
    }

    @CacheEvict(allEntries = true)
    public TransactionResponse create(TransactionRequest request) {
        TransactionType type = parseTransactionType(request == null ? null : request.getType());
        transactionDomainService.validateCreateRequest(request, type);

        var event = request.getEventId() == null ? null
                : eventRepository.findById(request.getEventId())
                        .orElseThrow(() -> new IllegalArgumentException("Khong tim thay event: " + request.getEventId()));
        var member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay thanh vien: " + request.getMemberId()));
        var createdBy = request.getCreatedById() == null ? null
                : memberRepository.findById(request.getCreatedById())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Khong tim thay nguoi tao: " + request.getCreatedById()));
        var approvedBy = request.getApprovedById() == null ? null
                : memberRepository.findById(request.getApprovedById())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Khong tim thay nguoi duyet: " + request.getApprovedById()));
        var entity = transactionMapper.toEntity(request, event, member, createdBy, approvedBy);
        return transactionMapper.toResponse(transactionRepository.save(entity));
    }

    @Cacheable(key = "'all'")
    public List<TransactionResponse> getAll() {
        return transactionRepository.findActive().stream()
                .map(transactionMapper::toResponse)
                .toList();
    }

    @Cacheable(key = "'type:' + #type")
    public List<TransactionResponse> getByType(String type) {
        return transactionRepository.findActiveByType(parseTransactionType(type)).stream()
                .map(transactionMapper::toResponse)
                .toList();
    }

    @Cacheable(key = "'event:' + #eventId")
    public List<TransactionResponse> getByEvent(String eventId) {
        return transactionRepository.findActiveByEventId(eventId).stream()
                .map(transactionMapper::toResponse)
                .toList();
    }

    @Cacheable(key = "'id:' + #id")
    public TransactionResponse getById(String id) {
        return transactionRepository.findById(id).map(transactionMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay transaction: " + id));
    }

    @CacheEvict(allEntries = true)
    public void delete(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay transaction: " + id));
        transaction.setDeletedAt(LocalDateTime.now());
        transactionRepository.save(transaction);
    }

    @Async("applicationTaskExecutor")
    public CompletableFuture<List<TransactionResponse>> getAllAsync() {
        return CompletableFuture.completedFuture(getAll());
    }

    private TransactionType parseTransactionType(String type) {
        return transactionMapper.parseTransactionType(type);
    }
}
