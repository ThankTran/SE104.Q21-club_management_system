package com.example.demo.application.dto.request.member;

import com.example.demo.domain.enums.ApprovalStatusEnum;
import com.example.demo.domain.enums.GraduatedStatusEnum;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberSearchRequest {
    private String fullName;        
    private String studentId;       
    private Long departmentId;   
    private ApprovalStatusEnum reqStatus;      
    private GraduatedStatusEnum graduatedStatus; 
}