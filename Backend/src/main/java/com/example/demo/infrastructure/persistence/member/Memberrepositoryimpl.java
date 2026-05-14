package com.example.demo.infrastructure.persistence.member;

import com.example.clubmanagement.domain.model.member.Member;
import com.example.clubmanagement.domain.enums.ApprovalStatusEnum;
import com.example.clubmanagement.domain.repository.member.MemberRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepository {

    private final MemberJpaRepository jpaRepository;

    @Override
    public Member save(Member member) {
        return jpaRepository.save(member);
    }

    @Override
    public Optional<Member> findById(Long memberId) {
        return jpaRepository.findById(memberId);
    }

    @Override
    public Optional<Member> findByStudentId(String studentId) {
        return jpaRepository.findByStudentId(studentId);
    }

    @Override
    public Optional<Member> findByEmail(String email) {
        return jpaRepository.findByEmail(email);
    }

    @Override
    public List<Member> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public List<Member> findAllByName(String name) {
        return jpaRepository.findAllByFullNameContaining(name);
    }

    @Override
    public List<Member> findByReqStatus(String reqStatus) {
        try {
            ApprovalStatusEnum status = ApprovalStatusEnum.valueOf(reqStatus.toUpperCase());
            return jpaRepository.findByReqStatus(status);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    @Override
    public void deleteById(Long memberId) {
        jpaRepository.deleteById(memberId);
    }

    public boolean existsByStudentId(String studentId) {
        return jpaRepository.existsByStudentId(studentId);
    }

    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }
}