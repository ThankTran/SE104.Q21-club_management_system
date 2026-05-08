package com.example.demo.application.dto.request.member;

import com.example.demo.domain.enums.GenderEnum;
import com.example.demo.domain.enums.GraduatedStatusEnum;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMemberRequest {

    private String studentId;

    private String fullName;

    private Long departmentId;

    private String email;

    private String phone;

    private LocalDate dateOfBirth;

    private GenderEnum gender;

    private GraduatedStatusEnum graduatedStatus;

}