package com.example.demo.application.dto.request.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class DocumentFileRequest {
    @NotNull(message = "Document id is required")
    private Long documentId;

    @NotNull(message = "File is required")
    private MultipartFile file;

}
