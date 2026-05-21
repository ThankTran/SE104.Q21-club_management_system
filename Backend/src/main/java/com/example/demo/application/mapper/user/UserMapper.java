package com.example.demo.application.mapper.user;

import com.example.demo.application.dto.response.user.UserPasswordResponse;
import com.example.demo.application.dto.response.user.UserResponse;
import com.example.demo.domain.model.user.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toResponse(User entity) {
        return UserResponse.builder()
                .userId(entity.getUserId())
                .memberId(entity.getMember().getMemberId())
                .studentId(entity.getMember().getStudentId())
                .fullName(entity.getMember().getFullName())
                .email(entity.getMember().getEmail())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public UserPasswordResponse toPasswordResponse(User entity) {
        return UserPasswordResponse.builder()
                .userId(entity.getUserId())
                .memberId(entity.getMember().getMemberId())
                .passwordHash(entity.getPasswordHash())
                .build();
    }
}
