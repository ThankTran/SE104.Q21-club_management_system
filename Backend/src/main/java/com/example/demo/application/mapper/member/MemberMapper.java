package com.example.demo.application.mapper.member;

import com.example.demo.application.dto.request.member.JoinClubRequest;
import com.example.demo.application.dto.response.member.MemberResponse;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.enums.GenderEnum;
import com.example.demo.domain.enums.ApprovalStatusEnum;

import org.springframework.stereotype.Component;

@Component
public class MemberMapper {
    public Member toEntity(JoinClubRequest request) {
        if (request == null) {
            return null;
        }
        
        return Member.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhoneNumber())
                .studentId(request.getStudentId())
                .gender(GenderEnum.valueOf(request.getGender().toUpperCase()))
                .dateOfBirth(request.getDateOfBirth())
                .reqStatus(ApprovalStatusEnum.PENDING)
                .build();
    }

    public MemberResponse toResponse(Member member) {
        if (member == null) {
            return null;
        }
        
        return MemberResponse.builder()
                .memberId(member.getMemberId())
                .fullName(member.getFullName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .studentId(member.getStudentId())
                .gender(member.getGender() != null ? member.getGender().name() : null)
                .dateOfBirth(member.getDateOfBirth())
                .status(member.getReqStatus() != null ? member.getReqStatus().name() : null)
                .build();
    }
}