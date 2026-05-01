package com.example.demo.application.service.Interface.member;

import com.example.demo.application.dto.request.JoinClubRequest;
import com.example.demo.application.dto.response.MemberResponse;

import java.util.List;

public interface MemberUseCase {
    MemberResponse registerMember(JoinClubRequest request);
    
    void approveMember(Long approvalId, String status, String note);
    
    List<MemberResponse> getAllMembers();
}