package com.example.demo.application.service.event.interfaces;

import com.example.demo.application.dto.request.event.EventOrganizerRequest;
import com.example.demo.application.dto.response.event.EventOrganizerResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface EventOrganizerService {
    EventOrganizerResponse create(EventOrganizerRequest request);

    List<EventOrganizerResponse> getByEvent(String eventId);

    List<EventOrganizerResponse> getByMember(Long memberId);

    void delete(String eventId, Long memberId);

    CompletableFuture<List<EventOrganizerResponse>> getByEventAsync(String eventId);
}
