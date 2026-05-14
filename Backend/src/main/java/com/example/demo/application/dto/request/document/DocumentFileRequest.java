package com.example.demo.application.dto.request.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DocumentFileRequest {
    @NotNull(message = "Document id is required")
    private Long documentId;

    @NotBlank(message = "File url must not be blank")
    @Size(max = 5000, message = "File url must not exceed 5000 characters")
    private String fileUrl;

    @NotBlank(message = "File name must not be blank")
    @Size(max = 255, message = "File name must not exceed 255 characters")
    private String fileName;

    @NotNull(message = "File size is required")
    @Positive(message = "File size must be a positive number")
    private Long fileSize;

    @NotBlank(message = "Mime type must not be blank")
    @Size(max = 255, message = "Mime type must not exceed 255 characters")
    private String mimeType;
}
