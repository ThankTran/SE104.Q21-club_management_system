package com.example.demo.application.mapper.member;

import com.example.demo.application.dto.request.member.CreateMemberRequest;
import com.example.demo.application.dto.request.member.JoinClubRequest;
import com.example.demo.application.dto.response.member.MemberResponse;
import com.example.demo.application.dto.response.member.MemberSearchResponse;
import com.example.demo.application.dto.response.department.DepartmentResponse;

import com.example.demo.domain.model.department.Department;
import com.example.demo.domain.model.member.Member;

import com.example.demo.domain.enums.ApprovalStatusEnum;
import com.example.demo.domain.enums.GenderEnum;

import org.springframework.stereotype.Component;

@Component
public class MemberMapper {

    public Member toEntity(CreateMemberRequest request) {
        if (request == null) return null;
        return Member.builder()
                .studentId(request.getStudentId())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .graduatedStatus(request.getGraduatedStatus())
                .reqStatus(ApprovalStatusEnum.PENDING)  
                .build();
    }

    public Member toEntity(JoinClubRequest request) {
        if (request == null) return null;
        return Member.builder()
                .studentId(request.getStudentId())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhoneNumber())
                .gender(GenderEnum.valueOf(request.getGender().toUpperCase()))
                .dateOfBirth(request.getDateOfBirth())
                .reqStatus(ApprovalStatusEnum.PENDING)
                .build();
    }

    public MemberResponse toResponse(Member member) {
        if (member == null) return null;
        return MemberResponse.builder()
                .memberId(member.getMemberId())
                .studentId(member.getStudentId())
                .fullName(member.getFullName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .gender(member.getGender() != null ? member.getGender().name() : null)
                .dateOfBirth(member.getDateOfBirth())
                .departmentId(member.getDepartment() != null
                        ? member.getDepartment().getDepartmentId() : null)
                .departmentName(member.getDepartment() != null
                        ? member.getDepartment().getDepartmentName() : null)
                .roleName(member.getRole() != null
                        ? member.getRole().getRoleName() : null)
                .reqStatus(member.getReqStatus() != null
                        ? member.getReqStatus().name() : null)
                .graduatedStatus(member.getGraduatedStatus() != null
                        ? member.getGraduatedStatus().name() : null)
                .createdAt(member.getCreatedAt())
                .build();
    }

    public MemberSearchResponse toSearchResponse(Member member) {
        if (member == null) return null;
        return MemberSearchResponse.builder()
                .memberId(member.getMemberId())
                .studentId(member.getStudentId())
                .fullName(member.getFullName())
                .dateOfBirth(member.getDateOfBirth())
                .departmentName(member.getDepartment() != null
                        ? member.getDepartment().getDepartmentName() : null)
                .phone(member.getPhone())
                .email(member.getEmail())
                .reqStatus(member.getReqStatus() != null
                        ? member.getReqStatus().name() : null)
                .graduatedStatus(member.getGraduatedStatus() != null
                        ? member.getGraduatedStatus().name() : null)
                .build();
    }

    public DepartmentResponse toDepartmentResponse(Department department) {
        if (department == null) return null;
        return DepartmentResponse.builder()
                .departmentId(department.getDepartmentId())
                .departmentName(department.getDepartmentName())
                .build();
    }
}