package com.example.demo.application.dto.request.event;

import com.example.demo.domain.enums.ApprovalStatusEnum;
import com.example.demo.domain.enums.EventStatusEnum;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class EventRequest {
    private String eventId;
    private String eventName;
    private String location;
    private LocalDate eventDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal estimatedCost;
    private Integer capacity;
    private String organizer;
    private String tag;
    private EventStatusEnum status;
    private ApprovalStatusEnum reqStatus;
    private String description;
    private Long evaluatedById;
    private LocalDateTime evaluationDate;
    private String evaluationContent;
}
