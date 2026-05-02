package com.example.demo.domain.repository.member;

import com.example.demo.domain.model.member.Member;

import java.util.Optional;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MemberRepository {
    Member save(Member member);

    Optional<Member> findById(Long memberId);

    Optional<Member> findByStudentId(String studentId);

    Optional<Member> findByEmail(String email);

    List<Member> findAll();

    List<Member> findAllByName(String name);

    List<Member> findByReqStatus(String reqStatus);

    void deleteById(Long memberId);
}