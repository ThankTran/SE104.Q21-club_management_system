package com.example.demo.application.dto.response.member;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class MemberResponse {
    private Long memberId;
    private String studentId;
    private String fullName;
    private Long departmentId;
    private String departmentName;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String roleName;
    private String reqstatus;
    private String graduatedStatus;
    private LocalDateTime createdAt;
}