package com.example.demo.application.dto.request.finance;

import com.example.demo.domain.enums.TransactionStatus;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class TransactionRequest {
    private String transactionId;
    private String eventId;
    private Long memberId;
    private String type;
    private BigDecimal amount;
    private String description;
    private TransactionStatus status;
    private Long createdById;
    private Long approvedById;
}
