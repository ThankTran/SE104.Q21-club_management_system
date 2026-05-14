package com.example.demo.application.mapper.finance;

import com.example.demo.application.dto.request.finance.TransactionRequest;
import com.example.demo.application.dto.response.finance.TransactionResponse;
import com.example.demo.domain.enums.TransactionStatus;
import com.example.demo.domain.enums.TransactionType;
import com.example.demo.domain.model.event.Event;
import com.example.demo.domain.model.finance.Transaction;
import com.example.demo.domain.model.member.Member;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public Transaction toEntity(
            TransactionRequest request,
            Event event,
            Member member,
            Member createdBy,
            Member approvedBy) {
        return Transaction.builder()
                .transactionId(request.getTransactionId())
                .event(event)
                .member(member)
                .type(parseTransactionType(request.getType()))
                .amount(request.getAmount())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TransactionStatus.PENDING)
                .createdBy(createdBy)
                .approvedBy(approvedBy)
                .build();
    }

    public TransactionResponse toResponse(Transaction entity) {
        return TransactionResponse.builder()
                .transactionId(entity.getTransactionId())
                .eventId(entity.getEvent() == null ? null : entity.getEvent().getEventId())
                .memberId(entity.getMember() == null ? null : entity.getMember().getMemberId())
                .type(entity.getType())
                .amount(entity.getAmount())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .createdById(entity.getCreatedBy() == null ? null : entity.getCreatedBy().getMemberId())
                .approvedById(entity.getApprovedBy() == null ? null : entity.getApprovedBy().getMemberId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .approvedAt(entity.getApprovedAt())
                .build();
    }

    public TransactionType parseTransactionType(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("Loại giao dịch không được để trống");
        }
        String t = raw.trim();
        if ("INCOME".equalsIgnoreCase(t)) {
            return TransactionType.INCOME;
        }
        if ("EXPENSE".equalsIgnoreCase(t)) {
            return TransactionType.Expense;
        }
        throw new IllegalArgumentException("Loại giao dịch chỉ nhận INCOME hoặc EXPENSE");
    }
}
