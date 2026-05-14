package com.example.demo.domain.service.event;

import com.example.demo.application.dto.request.event.EventRequest;
import java.time.LocalDate;

public interface EventDomainService {
    void validateCreateRequest(EventRequest request);

    void validateEventNameUniqueness(String eventName, boolean exists);

    void validateDateRange(LocalDate from, LocalDate to);
}
