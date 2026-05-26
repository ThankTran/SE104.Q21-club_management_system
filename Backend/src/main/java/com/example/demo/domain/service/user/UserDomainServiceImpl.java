package com.example.demo.domain.service.user;

import com.example.demo.domain.model.user.User;
import org.springframework.stereotype.Service;

@Service
public class UserDomainServiceImpl implements UserDomainService {
    private final PasswordHasher passwordHasher;

    public UserDomainServiceImpl(PasswordHasher passwordHasher) {
        this.passwordHasher = passwordHasher;
    }

    @Override
    public void validateCreateRequest(Long memberId, String password) {
        if (memberId == null) {
            throw new IllegalArgumentException("Member ID khong duoc de trong");
        }
        validatePasswordValue(password, "Mat khau");
    }

    @Override
    public void validateLoginRequest(Long userId, Long memberId, String username, String password) {
        if (userId == null && memberId == null && isBlank(username)) {
            throw new IllegalArgumentException("Can cung cap username, userId hoac memberId de dang nhap");
        }
        validatePasswordValue(password, "Mat khau");
    }

    @Override
    public void validateChangePasswordRequest(String currentPassword, String newPassword) {
        validatePasswordValue(currentPassword, "Mat khau hien tai");
        validatePasswordValue(newPassword, "Mat khau moi");
        if (currentPassword.equals(newPassword)) {
            throw new IllegalArgumentException("Mat khau moi phai khac mat khau hien tai");
        }
    }

    @Override
    public void verifyLogin(User user, String rawPassword) {
        if (user == null) {
            throw new IllegalArgumentException("Tai khoan khong ton tai");
        }
        if (!passwordHasher.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Thong tin dang nhap khong chinh xac");
        }
    }

    @Override
    public void changePassword(User user, String newPassword) {
        user.changePassword(passwordHasher.hash(newPassword));
    }

    private void validatePasswordValue(String password, String fieldName) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException(fieldName + " khong duoc de trong");
        }
        if (password.length() < 6) {
            throw new IllegalArgumentException(fieldName + " phai co it nhat 6 ky tu");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
