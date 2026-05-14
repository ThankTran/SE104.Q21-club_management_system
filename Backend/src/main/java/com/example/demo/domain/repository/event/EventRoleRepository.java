package com.example.demo.domain.repository.event;

import com.example.demo.domain.model.event.EventRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRoleRepository extends JpaRepository<EventRole, Short> {
    Optional<EventRole> findByRoleNameIgnoreCase(String roleName);
}
