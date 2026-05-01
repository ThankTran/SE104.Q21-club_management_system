package com.example.demo.application.mapper.member;

import com.example.demo.application.dto.request.JoinClubRequest;
import com.example.demo.application.dto.response.member.MemberResponse;
import com.example.demo.domain.model.Member;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
public class MemberMapper {
    public Member toEntity(JoinClubRequest request) {
        if (request == null) {
            return null;
        }
        Member member = new Member();
        member.setfullName(request.getfullName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        member.setStudentId(request.getStudentId());
        member.setGender(request.getGender());
        member.setDateOfBirth(request.getDateOfBirth());
        return member;
    }

    public MemberResponse toResponse(Member member) {
        if (member == null) {
            return null;
        }
        MemberResponse response = new MemberResponse();
        response.setMemberId(member.getId());
        response.setFullName(member.getfullName());
        response.setEmail(member.getEmail());
        response.setPhone(member.getPhone());
        response.setStudentId(member.getStudentId());
        response.setGender(member.getGender());
        response.setDateOfBirth(member.getDateOfBirth());
        response.setStatus(member.getStatus().name());
        return response;
    }
}