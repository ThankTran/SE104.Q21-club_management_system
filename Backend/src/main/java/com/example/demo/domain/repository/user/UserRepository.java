package com.example.demo.domain.repository.user;

import com.example.demo.domain.model.user.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    @Override
    @EntityGraph(attributePaths = {"member", "member.department", "member.role"})
    List<User> findAll();

    @Override
    @EntityGraph(attributePaths = {"member", "member.department", "member.role"})
    Optional<User> findById(Long userId);

    @EntityGraph(attributePaths = {"member", "member.department", "member.role"})
    Optional<User> findByMemberMemberId(Long memberId);

    boolean existsByMemberMemberId(Long memberId);
}
