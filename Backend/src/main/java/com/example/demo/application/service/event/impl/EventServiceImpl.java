package com.example.demo.application.service.event.impl;

import com.example.demo.application.dto.request.event.EventRequest;
import com.example.demo.application.dto.response.event.EventCalendarLinkResponse;
import com.example.demo.application.dto.response.event.EventResponse;
import com.example.demo.application.mapper.event.EventMapper;
import com.example.demo.domain.model.event.Event;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.repository.event.EventOrganizerRepository;
import com.example.demo.domain.repository.event.EventRepository;
import com.example.demo.domain.repository.finance.TransactionRepository;
import com.example.demo.domain.repository.member.MemberRepository;
import com.example.demo.domain.service.event.EventDomainService;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@CacheConfig(cacheNames = "events")
public class EventServiceImpl implements com.example.demo.application.service.event.interfaces.EventService {
    private static final ZoneId EVENT_TIMEZONE = ZoneId.of("Asia/Bangkok");
    private static final DateTimeFormatter GOOGLE_CALENDAR_DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");

    private final EventRepository eventRepository;
    private final EventOrganizerRepository eventOrganizerRepository;
    private final TransactionRepository transactionRepository;
    private final MemberRepository memberRepository;
    private final EventMapper eventMapper;
    private final EventDomainService eventDomainService;

    public EventServiceImpl(
            EventRepository eventRepository,
            EventOrganizerRepository eventOrganizerRepository,
            TransactionRepository transactionRepository,
            MemberRepository memberRepository,
            EventMapper eventMapper,
            EventDomainService eventDomainService) {
        this.eventRepository = eventRepository;
        this.eventOrganizerRepository = eventOrganizerRepository;
        this.transactionRepository = transactionRepository;
        this.memberRepository = memberRepository;
        this.eventMapper = eventMapper;
        this.eventDomainService = eventDomainService;
    }

    @CacheEvict(allEntries = true)
    public EventResponse create(EventRequest request) {
        eventDomainService.validateCreateRequest(request);
        eventDomainService.validateEventNameUniqueness(
                request.getEventName(),
                eventRepository.existsByEventNameIgnoreCase(request.getEventName()));

        Member evaluatedBy = null;
        if (request.getEvaluatedById() != null) {
            evaluatedBy = memberRepository.findById(request.getEvaluatedById())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Khong tim thay thanh vien danh gia: " + request.getEvaluatedById()));
        }
        return eventMapper.toResponse(eventRepository.save(eventMapper.toEntity(request, evaluatedBy)));
    }

    @Cacheable(key = "'all'")
    public List<EventResponse> getAll() {
        return eventRepository.findAll().stream().map(eventMapper::toResponse).toList();
    }

    @Cacheable(key = "'name:' + #eventName")
    public List<EventResponse> searchByName(String eventName) {
        return eventRepository.searchByName(eventName).stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Cacheable(key = "'range:' + #from + '|' + #to")
    public List<EventResponse> getByDateRange(LocalDate from, LocalDate to) {
        eventDomainService.validateDateRange(from, to);
        return eventRepository.findByEventDateRange(from, to).stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Cacheable(key = "'id:' + #id")
    public EventResponse getById(String id) {
        return eventRepository.findById(id).map(eventMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay event: " + id));
    }

    @Override
    public EventCalendarLinkResponse getGoogleCalendarLink(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay event: " + id));

        if (event.getStartTime() == null || event.getEndTime() == null) {
            throw new IllegalArgumentException("Event chua co du thong tin thoi gian de tao link Google Calendar");
        }

        String details = buildEventDetails(event);
        String dates = event.getStartTime().atZone(EVENT_TIMEZONE).withZoneSameInstant(ZoneId.of("UTC"))
                .format(GOOGLE_CALENDAR_DATE_FORMAT)
                + "/"
                + event.getEndTime().atZone(EVENT_TIMEZONE).withZoneSameInstant(ZoneId.of("UTC"))
                .format(GOOGLE_CALENDAR_DATE_FORMAT);

        String googleCalendarLink = UriComponentsBuilder
                .fromUriString("https://calendar.google.com/calendar/render")
                .queryParam("action", "TEMPLATE")
                .queryParam("text", event.getEventName())
                .queryParam("dates", dates)
                .queryParam("details", details)
                .queryParam("location", event.getLocation())
                .build()
                .toUriString();

        return EventCalendarLinkResponse.builder()
                .eventId(event.getEventId())
                .googleCalendarLink(googleCalendarLink)
                .build();
    }

    @CacheEvict(allEntries = true)
    public void delete(String id) {
        if (!eventRepository.existsById(id)) {
            throw new IllegalArgumentException("Event not found: " + id);
        }
        if (eventOrganizerRepository.existsByEventEventId(id)) {
            throw new IllegalArgumentException(
                    "Cannot delete event because organizers still reference it.");
        }
        if (transactionRepository.existsByEventEventId(id)) {
            throw new IllegalArgumentException(
                    "Cannot delete event because transactions still reference it.");
        }
        eventRepository.deleteById(id);
    }

    @Async("applicationTaskExecutor")
    public CompletableFuture<List<EventResponse>> getAllAsync() {
        return CompletableFuture.completedFuture(getAll());
    }

    @Async("applicationTaskExecutor")
    public CompletableFuture<List<EventResponse>> searchByNameAsync(String eventName) {
        return CompletableFuture.completedFuture(searchByName(eventName));
    }

    @Async("applicationTaskExecutor")
    public CompletableFuture<List<EventResponse>> getByDateRangeAsync(LocalDate from, LocalDate to) {
        return CompletableFuture.completedFuture(getByDateRange(from, to));
    }

    @Async("applicationTaskExecutor")
    public CompletableFuture<EventResponse> getByIdAsync(String id) {
        return CompletableFuture.completedFuture(getById(id));
    }

    private String buildEventDetails(Event event) {
        StringBuilder details = new StringBuilder();
        if (event.getDescription() != null && !event.getDescription().isBlank()) {
            details.append(event.getDescription().trim());
        }
        if (event.getEventId() != null && !event.getEventId().isBlank()) {
            if (details.length() > 0) {
                details.append("\n\n");
            }
            details.append("Ma su kien: ").append(event.getEventId());
        }
        return details.toString();
    }
}
