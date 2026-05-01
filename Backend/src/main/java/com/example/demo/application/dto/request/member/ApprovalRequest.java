package com.example.demo.application.dto.request.member;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ApprovalRequest {
    private Long memberId;
    private Long approvedBy;
    private String status; 
    private String note; 
}