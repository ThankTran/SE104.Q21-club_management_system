package com.example.demo.application.service.event.interfaces;

import com.example.demo.application.dto.request.event.EventAttendanceRequest;
import com.example.demo.application.dto.response.event.EventRegistrationResponse;
import java.util.List;

public interface EventRegistrationService {
    EventRegistrationResponse register(String eventId, Long memberId);

    List<EventRegistrationResponse> getByEvent(String eventId);

    List<EventRegistrationResponse> getByMember(Long memberId);

    List<EventRegistrationResponse> updateAttendance(String eventId, EventAttendanceRequest request);

    void unregister(String eventId, Long memberId);
}
