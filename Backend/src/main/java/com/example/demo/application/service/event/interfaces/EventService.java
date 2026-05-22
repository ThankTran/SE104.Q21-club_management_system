package com.example.demo.application.service.event.interfaces;

import com.example.demo.application.dto.request.event.EventRequest;
import com.example.demo.application.dto.response.event.EventCalendarLinkResponse;
import com.example.demo.application.dto.response.event.EventResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface EventService {
    EventResponse create(EventRequest request);

    List<EventResponse> getAll();

    List<EventResponse> searchByName(String eventName);

    List<EventResponse> getByDateRange(LocalDate from, LocalDate to);

    EventResponse getById(String id);

    EventCalendarLinkResponse getGoogleCalendarLink(String id);

    void delete(String id);

    CompletableFuture<List<EventResponse>> getAllAsync();

    CompletableFuture<List<EventResponse>> searchByNameAsync(String eventName);

    CompletableFuture<List<EventResponse>> getByDateRangeAsync(LocalDate from, LocalDate to);

    CompletableFuture<EventResponse> getByIdAsync(String id);
}
