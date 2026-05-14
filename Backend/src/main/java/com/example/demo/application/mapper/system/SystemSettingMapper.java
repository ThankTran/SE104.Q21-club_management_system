package com.example.demo.application.mapper.system;

import com.example.demo.application.dto.request.system.SystemSettingRequest;
import com.example.demo.application.dto.response.system.SystemSettingResponse;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.model.system.SystemSetting;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class SystemSettingMapper {
    public SystemSetting toEntity(SystemSettingRequest request, Member updatedBy) {
        return SystemSetting.builder()
                .settingKey(request.getSettingKey())
                .settingValue(request.getSettingValue())
                .description(request.getDescription())
                .updatedBy(updatedBy)
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public SystemSettingResponse toResponse(SystemSetting entity) {
        return SystemSettingResponse.builder()
                .settingKey(entity.getSettingKey())
                .settingValue(entity.getSettingValue())
                .description(entity.getDescription())
                .updatedById(entity.getUpdatedBy() != null ? entity.getUpdatedBy().getMemberId() : null)
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

