package com.example.demo.application.dto.request.event;

import java.util.List;
import lombok.Data;

@Data
public class EventAttendanceRequest {
    private Long memberId;
    private List<Long> memberIds;
    private Boolean attended;
}
