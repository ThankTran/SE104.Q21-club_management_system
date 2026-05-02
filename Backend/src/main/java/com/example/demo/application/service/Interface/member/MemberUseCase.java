package com.example.demo.application.service.Interface.member;

import com.example.demo.application.dto.request.member.JoinClubRequest;
import com.example.demo.application.dto.request.member.ApprovalRequest;
import com.example.demo.application.dto.response.member.MemberResponse;
import com.example.demo.application.dto.request.member.MemberSearchRequest;
import com.example.demo.domain.enums.ApprovalStatusEnum;

import java.util.List;

public interface MemberUseCase {
    MemberResponse registerMember(JoinClubRequest request);
    
    MemberResponse approveMember(ApprovalRequest request);
    
    List<MemberResponse> getAllMembers();

    List<MemberResponse> searchMembers(MemberSearchRequest request);
    
    MemberResponse getMemberById(Long memberId);
    
    MemberResponse updateMember(Long memberId, JoinClubRequest request);
}