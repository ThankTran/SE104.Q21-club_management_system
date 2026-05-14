package com.example.demo.application.dto.request.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DocumentStatusRequest {
    @NotBlank(message = "Status name must not be blank")
    @Size(max = 100, message = "Status name must not exceed 100 characters")
    private String statusName;
}
