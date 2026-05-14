package com.example.demo.application.mapper.event;

import com.example.demo.application.dto.request.event.EventOrganizerRequest;
import com.example.demo.application.dto.response.event.EventOrganizerResponse;
import com.example.demo.domain.model.event.Event;
import com.example.demo.domain.model.event.EventOrganizer;
import com.example.demo.domain.model.event.EventOrganizerId;
import com.example.demo.domain.model.event.EventRole;
import com.example.demo.domain.model.member.Member;
import org.springframework.stereotype.Component;

@Component
public class EventOrganizerMapper {

    public EventOrganizer toEntity(
            EventOrganizerRequest request,
            Event event,
            Member member,
            EventRole role) {
        EventOrganizerId id = new EventOrganizerId(request.getEventId(), request.getMemberId());
        return EventOrganizer.builder()
                .id(id)
                .event(event)
                .member(member)
                .role(role)
                .build();
    }

    public EventOrganizerResponse toResponse(EventOrganizer entity) {
        String eventId = entity.getId() != null ? entity.getId().getEventId() : null;
        Long memberId = entity.getId() != null ? entity.getId().getMemberId() : null;
        Short roleId = entity.getRole() == null ? null : entity.getRole().getRoleId();
        String roleName = entity.getRole() == null ? null : entity.getRole().getRoleName();
        return EventOrganizerResponse.builder()
                .eventId(eventId)
                .memberId(memberId)
                .roleId(roleId)
                .roleName(roleName)
                .build();
    }
}
