package com.example.demo.controller.notification;

import com.example.demo.application.dto.request.notification.NotificationRecipientRequest;
import com.example.demo.application.dto.response.notification.NotificationRecipientResponse;
import com.example.demo.application.service.notification.interfaces.NotificationRecipientService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification-recipients")
public class NotificationRecipientController {

    private final NotificationRecipientService notificationRecipientService;

    public NotificationRecipientController(NotificationRecipientService notificationRecipientService) {
        this.notificationRecipientService = notificationRecipientService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody NotificationRecipientRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(notificationRecipientService.create(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/by-notification/{notificationId}")
    public ResponseEntity<List<NotificationRecipientResponse>> byNotification(@PathVariable Long notificationId) {
        return ResponseEntity.ok(notificationRecipientService.getByNotification(notificationId));
    }

    @GetMapping("/by-member/{memberId}")
    public ResponseEntity<List<NotificationRecipientResponse>> byMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(notificationRecipientService.getByMember(memberId));
    }

    @DeleteMapping("/{notificationId}/members/{memberId}")
    public ResponseEntity<Void> delete(@PathVariable Long notificationId, @PathVariable Long memberId) {
        notificationRecipientService.delete(notificationId, memberId);
        return ResponseEntity.noContent().build();
    }
}
