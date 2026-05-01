package com.example.demo.application.dto.request.member;

import lonbok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class JoinClubRequest {
    private String studentId;
    private String fullName;
    private Long departmentId;
    private String email;
    private String phoneNumber;
    private String gender;
    private LocalDateTime dateOfBirth;
}