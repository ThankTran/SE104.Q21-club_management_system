package com.example.demo.application.service.Interface.member;

import com.example.demo.application.dto.request.member.JoinClubRequest;
import com.example.demo.application.dto.request.member.ApprovalRequest;
import com.example.demo.application.dto.response.member.MemberResponse;
import com.example.demo.domain.enums.ApprovalStatusEnum;

import java.util.List;

public interface MemberUseCase {
    MemberResponse registerMember(JoinClubRequest request);
    
    MemberResponse approveMember(ApprovalRequest request);
    
    List<MemberResponse> getAllMembers();
    
    MemberResponse getMemberById(Long memberId);
}