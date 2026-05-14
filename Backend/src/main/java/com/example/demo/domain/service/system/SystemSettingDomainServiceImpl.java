package com.example.demo.domain.service.system;

import com.example.demo.application.dto.request.system.SystemSettingRequest;
import com.example.demo.domain.model.member.Member;
import org.springframework.stereotype.Service;

@Service
public class SystemSettingDomainServiceImpl implements SystemSettingDomainService {
    @Override
    public void validateCreateOrUpdateRequest(SystemSettingRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("System setting request must not be empty");
        }
        if (request.getSettingKey() == null || request.getSettingKey().isBlank()) {
            throw new IllegalArgumentException("Setting key must not be empty");
        }
        if (request.getSettingValue() == null || request.getSettingValue().isBlank()) {
            throw new IllegalArgumentException("Setting value must not be empty");
        }
    }

    @Override
    public void validateUpdatedBy(Member updatedBy) {
        if (updatedBy == null) {
            throw new IllegalArgumentException("Updated by member must exist");
        }
    }

    @Override
    public void validateDelete(String key) {
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("Setting key must not be empty");
        }
    }
}
