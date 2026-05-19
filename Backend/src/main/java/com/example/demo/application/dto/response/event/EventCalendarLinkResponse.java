package com.example.demo.application.dto.response.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventCalendarLinkResponse {
    private String eventId;
    private String googleCalendarLink;
}
