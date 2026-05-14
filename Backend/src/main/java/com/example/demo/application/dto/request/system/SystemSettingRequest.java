package com.example.demo.application.dto.request.system;

import lombok.Data;

@Data
public class SystemSettingRequest {
    private String settingKey;
    private String settingValue;
    private String description;
    private Long updatedById;
}

