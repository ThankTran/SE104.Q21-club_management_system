package com.example.demo.application.dto.response.system;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SystemSettingResponse {
    private String settingKey;
    private String settingValue;
    private String description;
    private Long updatedById;
    private LocalDateTime updatedAt;
}

