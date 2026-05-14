package com.example.demo.domain.service.finance;

import java.time.LocalDateTime;

public interface FinanceDomainService {
    void validateTimeRange(LocalDateTime from, LocalDateTime to);

    void validateEventId(String eventId);
}
