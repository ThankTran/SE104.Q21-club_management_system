package com.example.demo.domain.service.finance;

import com.example.demo.application.dto.request.finance.TransactionRequest;
import com.example.demo.domain.enums.TransactionType;

public interface TransactionDomainService {
    void validateCreateRequest(TransactionRequest request, TransactionType type);
}
