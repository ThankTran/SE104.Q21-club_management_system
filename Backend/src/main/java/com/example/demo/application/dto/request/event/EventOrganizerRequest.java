package com.example.demo.application.dto.request.event;

import lombok.Data;

@Data
public class EventOrganizerRequest {
    private String eventId;
    private Long memberId;
    private Short roleId;
}
