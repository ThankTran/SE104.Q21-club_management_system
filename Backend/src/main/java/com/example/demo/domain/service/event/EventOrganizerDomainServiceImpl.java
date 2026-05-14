package com.example.demo.domain.service.event;

import com.example.demo.application.dto.request.event.EventOrganizerRequest;
import org.springframework.stereotype.Service;

@Service
public class EventOrganizerDomainServiceImpl implements EventOrganizerDomainService {
    @Override
    public void validateCreateRequest(EventOrganizerRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Event organizer request must not be empty");
        }
        if (request.getEventId() == null || request.getEventId().isBlank()) {
            throw new IllegalArgumentException("Event ID must not be empty");
        }
        if (request.getMemberId() == null) {
            throw new IllegalArgumentException("Member ID must not be empty");
        }
        if (request.getRoleId() == null) {
            throw new IllegalArgumentException("Event role ID must not be empty");
        }
    }

    @Override
    public void validateAssignmentUniqueness(String eventId, Long memberId, boolean exists) {
        if (exists) {
            throw new IllegalArgumentException(
                    "Member " + memberId + " is already assigned to event " + eventId);
        }
    }

    @Override
    public void validateDelete(String eventId, Long memberId) {
        if (eventId == null || eventId.isBlank()) {
            throw new IllegalArgumentException("Event ID must not be empty");
        }
        if (memberId == null) {
            throw new IllegalArgumentException("Member ID must not be empty");
        }
    }
}
