package com.example.demo.controller.document;

import com.example.demo.application.dto.request.document.DocumentFileRequest;
import com.example.demo.application.dto.response.document.DocumentFileResponse;
import com.example.demo.application.service.document.interfaces.DocumentFileService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/document-files")
public class DocumentFileController {

    private final DocumentFileService documentFileService;

    public DocumentFileController(DocumentFileService documentFileService) {
        this.documentFileService = documentFileService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@Valid @RequestBody DocumentFileRequest request) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(documentFileService.create(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/by-document/{documentId}")
    public ResponseEntity<List<DocumentFileResponse>> listByDocument(@PathVariable Long documentId) {
        return ResponseEntity.ok(documentFileService.getByDocumentId(documentId));
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> delete(@PathVariable Long fileId) {
        documentFileService.delete(fileId);
        return ResponseEntity.noContent().build();
    }
}
