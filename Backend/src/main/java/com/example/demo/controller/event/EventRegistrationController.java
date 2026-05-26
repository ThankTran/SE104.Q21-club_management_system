package com.example.demo.controller.event;

import com.example.demo.application.dto.request.event.EventAttendanceRequest;
import com.example.demo.application.dto.request.event.EventRegistrationRequest;
import com.example.demo.application.dto.response.event.EventRegistrationResponse;
import com.example.demo.application.service.event.interfaces.EventRegistrationService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/events")
public class EventRegistrationController {
    private final EventRegistrationService eventRegistrationService;

    public EventRegistrationController(EventRegistrationService eventRegistrationService) {
        this.eventRegistrationService = eventRegistrationService;
    }

    @PostMapping("/{eventId}/registrations")
    public ResponseEntity<?> register(
            @PathVariable String eventId,
            @RequestBody EventRegistrationRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(eventRegistrationService.register(eventId, request == null ? null : request.getMemberId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{eventId}/registrations")
    public ResponseEntity<List<EventRegistrationResponse>> getByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(eventRegistrationService.getByEvent(eventId));
    }

    @GetMapping("/registrations/by-member/{memberId}")
    public ResponseEntity<List<EventRegistrationResponse>> getByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(eventRegistrationService.getByMember(memberId));
    }

    @PutMapping("/{eventId}/attendance")
    public ResponseEntity<?> updateAttendance(
            @PathVariable String eventId,
            @RequestBody EventAttendanceRequest request) {
        try {
            return ResponseEntity.ok(eventRegistrationService.updateAttendance(eventId, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{eventId}/registrations/{memberId}")
    public ResponseEntity<?> unregister(@PathVariable String eventId, @PathVariable Long memberId) {
        try {
            eventRegistrationService.unregister(eventId, memberId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
