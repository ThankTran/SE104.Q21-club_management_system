package com.example.demo.infrastructure.persistence.member;

import com.example.clubmanagement.domain.model.member.Member;
import com.example.clubmanagement.domain.model.member.MemberApproval;
import com.example.clubmanagement.domain.enums.ApprovalStatusEnum;
import com.example.clubmanagement.domain.repository.member.MemberApprovalRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MemberApprovalRepositoryImpl implements MemberApprovalRepository {

    private final MemberApprovalJpaRepository jpaRepository;

    @Override
    public MemberApproval save(MemberApproval approval) {
        return jpaRepository.save(approval);
    }

    @Override
    public Optional<MemberApproval> findById(Long approvalId) {
        return jpaRepository.findById(approvalId);
    }

    @Override
    public Optional<MemberApproval> findByMemberId(Long memberId) {
        return jpaRepository.findByMember_MemberId(memberId);
    }

    @Override
    public Optional<MemberApproval> findByMember(Member member) {
        return jpaRepository.findByMember(member);
    }

    @Override
    public List<MemberApproval> findByStatus(ApprovalStatusEnum status) {
        return jpaRepository.findByStatus(status);
    }

    @Override
    public List<MemberApproval> findByApprovedBy(Long approverId) {
        return jpaRepository.findByApprovedBy_MemberId(approverId);
    }

    @Override
    public boolean existsByMemberId(Long memberId) {
        return jpaRepository.existsByMember_MemberId(memberId);
    }
}