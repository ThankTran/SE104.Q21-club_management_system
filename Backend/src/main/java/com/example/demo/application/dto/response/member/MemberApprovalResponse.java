package com.example.demo.application.dto.response.member;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberApprovalResponse {

    private Long approvalId;
    private String status;              

    private Long memberId;
    private String studentId;
    private String fullName;

    private Long approvedById;
    private String approvedByName;

    private LocalDateTime approvalDate;
    private LocalDateTime approvedAt;   

    private String note;
}