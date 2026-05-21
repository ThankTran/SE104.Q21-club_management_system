package com.example.demo.controller.event;

import com.example.demo.application.dto.request.event.EventOrganizerRequest;
import com.example.demo.application.dto.response.event.EventOrganizerResponse;
import com.example.demo.application.service.interfaces.event.EventOrganizerService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/event-organizers")
public class EventOrganizerController {

    private final EventOrganizerService eventOrganizerService;

    public EventOrganizerController(EventOrganizerService eventOrganizerService) {
        this.eventOrganizerService = eventOrganizerService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody EventOrganizerRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(eventOrganizerService.create(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/by-event/{eventId}")
    public ResponseEntity<List<EventOrganizerResponse>> byEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(eventOrganizerService.getByEvent(eventId));
    }

    @GetMapping("/by-member/{memberId}")
    public ResponseEntity<List<EventOrganizerResponse>> byMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(eventOrganizerService.getByMember(memberId));
    }

    @DeleteMapping("/{eventId}/members/{memberId}")
    public ResponseEntity<Void> delete(@PathVariable String eventId, @PathVariable Long memberId) {
        eventOrganizerService.delete(eventId, memberId);
        return ResponseEntity.noContent().build();
    }
}
