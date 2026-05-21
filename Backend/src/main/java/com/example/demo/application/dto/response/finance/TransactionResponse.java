package com.example.demo.application.dto.response.finance;

import com.example.demo.domain.enums.TransactionStatus;
import com.example.demo.domain.enums.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {
    private String transactionId;
    private String eventId;
    private Long memberId;
    private TransactionType type;
    private BigDecimal amount;
    private String description;
    private TransactionStatus status;
    private Long createdById;
    private Long approvedById;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;
}
