package com.example.demo.application.dto.response.member;

import lambok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class MemberResponse {
    private Long memberId;
    private String studentId;
    private String fullName;
    private String departmentName;
    private String email;
    private String reqStatus; 
    private LocalDateTime createdAt;
}