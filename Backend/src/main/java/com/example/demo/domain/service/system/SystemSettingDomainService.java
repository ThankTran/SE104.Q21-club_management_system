package com.example.demo.domain.service.system;

import com.example.demo.application.dto.request.system.SystemSettingRequest;
import com.example.demo.domain.model.member.Member;

public interface SystemSettingDomainService {
    void validateCreateOrUpdateRequest(SystemSettingRequest request);

    void validateUpdatedBy(Member updatedBy);

    void validateDelete(String key);
}
