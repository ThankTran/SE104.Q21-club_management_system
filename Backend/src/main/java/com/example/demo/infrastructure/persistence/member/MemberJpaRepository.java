package com.example.demo.infrastructure.persistence.member;

import com.example.clubmanagement.domain.model.member.Member;
import com.example.clubmanagement.domain.enums.ApprovalStatusEnum;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberJpaRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByStudentId(String studentId);

    Optional<Member> findByEmail(String email);

    boolean existsByStudentId(String studentId);

    boolean existsByEmail(String email);

    @Query("SELECT m FROM Member m WHERE LOWER(m.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Member> findAllByFullNameContaining(@Param("name") String name);

    List<Member> findByReqStatus(ApprovalStatusEnum reqStatus);
}