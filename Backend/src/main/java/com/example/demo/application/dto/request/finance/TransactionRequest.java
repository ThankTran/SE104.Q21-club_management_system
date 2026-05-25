package com.example.demo.application.dto.request.finance;

import com.example.demo.domain.enums.TransactionStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class TransactionRequest {
    private String transactionId;
    private String eventId;
    private Long memberId;
    private String counterpartyName;
    private String type;
    private BigDecimal amount;
    private String description;
    private LocalDateTime transactionDate;
    private TransactionStatus status;
    private Long createdById;
    private Long approvedById;
}
