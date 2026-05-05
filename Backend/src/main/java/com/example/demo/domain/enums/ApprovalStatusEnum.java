package com.example.demo.domain.enums;

import lombok.*;

public enum ApprovalStatus {
    PENDING("Chờ duyệt"),
    APPROVED("Đã duyệt"),
    REJECTED("Bị từ chối"),

    REQUESTED_CHANGES("Yêu cầu chỉnh sửa");

    private final String value;

    ApprovalStatus(String value) {
        this.value = value;
    }
}