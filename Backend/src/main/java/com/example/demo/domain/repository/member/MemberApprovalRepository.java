package com.example.clubmanagement.domain.repository.member;

import com.example.clubmanagement.domain.model.member.MemberApproval;
import com.example.clubmanagement.domain.enums.ApprovalStatusEnum;
import java.util.List;
import java.util.Optional;

public interface MemberApprovalRepository {
    MemberApproval save(MemberApproval approval);

    Optional<MemberApproval> findById(Long approvalId);

    Optional<MemberApproval> findByMemberId(Long memberId);

    List<MemberApproval> findByStatus(ApprovalStatusEnum status);

    List<MemberApproval> findByApprovedBy(Long approverId);

    boolean existsByMemberId(Long memberId);
}