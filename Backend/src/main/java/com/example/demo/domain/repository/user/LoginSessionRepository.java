package com.example.demo.domain.repository.user;

import com.example.demo.domain.model.user.LoginSession;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginSessionRepository extends JpaRepository<LoginSession, Long> {
    @EntityGraph(attributePaths = {"user", "user.member"})
    List<LoginSession> findTop20ByUserUserIdOrderByLoginAtDesc(Long userId);
}
