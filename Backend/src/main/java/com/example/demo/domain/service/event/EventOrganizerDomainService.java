package com.example.demo.domain.service.event;

import com.example.demo.application.dto.request.event.EventOrganizerRequest;

public interface EventOrganizerDomainService {
    void validateCreateRequest(EventOrganizerRequest request);

    void validateAssignmentUniqueness(String eventId, Long memberId, boolean exists);

    void validateDelete(String eventId, Long memberId);
}
