package com.example.demo.application.mapper.event;

import com.example.demo.application.dto.response.event.EventRegistrationResponse;
import com.example.demo.domain.model.event.EventRegistration;
import com.example.demo.domain.model.member.Member;
import org.springframework.stereotype.Component;

@Component
public class EventRegistrationMapper {
    public EventRegistrationResponse toResponse(EventRegistration entity) {
        Member member = entity.getMember();
        String departmentName = member.getDepartment() == null ? null : member.getDepartment().getDepartmentName();
        return EventRegistrationResponse.builder()
                .eventId(entity.getId() == null ? null : entity.getId().getEventId())
                .memberId(entity.getId() == null ? null : entity.getId().getMemberId())
                .studentId(member.getStudentId())
                .fullName(member.getFullName())
                .departmentName(departmentName)
                .email(member.getEmail())
                .registeredAt(entity.getRegisteredAt())
                .attended(entity.getAttended())
                .attendedAt(entity.getAttendedAt())
                .build();
    }
}
