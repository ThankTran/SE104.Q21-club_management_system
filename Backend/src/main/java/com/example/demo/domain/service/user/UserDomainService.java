package com.example.demo.domain.service.user;

import com.example.demo.domain.model.user.User;

public interface UserDomainService {
    void validateCreateRequest(Long memberId, String password);

    void validateLoginRequest(Long userId, Long memberId, String password);

    void validateChangePasswordRequest(String currentPassword, String newPassword);

    void verifyLogin(User user, String rawPassword);

    void changePassword(User user, String newPassword);
}
