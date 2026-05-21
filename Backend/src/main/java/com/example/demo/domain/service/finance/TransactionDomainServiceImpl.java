package com.example.demo.domain.service.finance;

import com.example.demo.application.dto.request.finance.TransactionRequest;
import com.example.demo.domain.enums.TransactionType;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;

@Service
public class TransactionDomainServiceImpl implements TransactionDomainService {
    @Override
    public void validateCreateRequest(TransactionRequest request, TransactionType type) {
        if (request == null) {
            throw new IllegalArgumentException("Transaction request must not be empty");
        }
        if (request.getTransactionId() == null || request.getTransactionId().isBlank()) {
            throw new IllegalArgumentException("Transaction ID must not be empty");
        }
        if (type == null) {
            throw new IllegalArgumentException("Transaction type must not be empty");
        }
        if (request.getMemberId() == null) {
            throw new IllegalArgumentException("Transaction member is required");
        }
        if (request.getDescription() == null || request.getDescription().isBlank()) {
            throw new IllegalArgumentException("Transaction description must not be empty");
        }
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transaction amount must be greater than zero");
        }
        if (type == TransactionType.Expense && (request.getEventId() == null || request.getEventId().isBlank())) {
            throw new IllegalArgumentException("Expense transaction must reference an event");
        }
    }
}
