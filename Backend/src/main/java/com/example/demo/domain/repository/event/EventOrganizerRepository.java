package com.example.demo.domain.repository.event;

import com.example.demo.domain.model.event.EventOrganizer;
import com.example.demo.domain.model.event.EventOrganizerId;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventOrganizerRepository extends JpaRepository<EventOrganizer, EventOrganizerId> {
    @EntityGraph(attributePaths = {"event", "member", "role"})
    List<EventOrganizer> findByEventEventId(String eventId);

    @EntityGraph(attributePaths = {"event", "member", "role"})
    List<EventOrganizer> findByMemberMemberId(Long memberId);

    boolean existsByEventEventId(String eventId);

    boolean existsByMemberMemberId(Long memberId);

    boolean existsByRoleRoleId(Short roleId);
}
