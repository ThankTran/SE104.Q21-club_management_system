package com.example.demo.infrastructure.persistence.member;

import com.example.clubmanagement.domain.model.member.Member;
import com.example.clubmanagement.domain.model.member.MemberApproval;
import com.example.clubmanagement.domain.enums.ApprovalStatusEnum;
import com.example.clubmanagement.domain.repository.member.MemberApprovalRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberApprovalJpaRepository extends JpaRepository<MemberApproval, Long> {

    // Dùng trong MemberService: findByMember(member)
    Optional<MemberApproval> findByMember(Member member);

    // Dùng khi chỉ có memberId
    Optional<MemberApproval> findByMember_MemberId(Long memberId);

    List<MemberApproval> findByStatus(ApprovalStatusEnum status);

    // findByApprovedBy(approverId) → navigate qua FK approved_by -> member_id
    List<MemberApproval> findByApprovedBy_MemberId(Long approverId);

    boolean existsByMember_MemberId(Long memberId);
}