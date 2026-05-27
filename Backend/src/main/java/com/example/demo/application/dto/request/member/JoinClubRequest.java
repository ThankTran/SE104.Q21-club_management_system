package com.example.demo.application.dto.request.member;

import com.example.demo.domain.enums.GraduatedStatusEnum;
import lombok.*;
import java.time.LocalDate;

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
    private LocalDate dateOfBirth;
    private GraduatedStatusEnum graduatedStatus;
    private String roleName;
}
