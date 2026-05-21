package com.example.demo.controller.document;

import com.example.demo.application.dto.request.document.DocumentStatusRequest;
import com.example.demo.application.dto.response.document.DocumentStatusResponse;
import com.example.demo.application.service.interfaces.document.DocumentStatusService;
import com.example.demo.application.exception.BusinessException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/document-statuses")
public class DocumentStatusController {

    private final DocumentStatusService documentStatusService;

    public DocumentStatusController(DocumentStatusService documentStatusService) {
        this.documentStatusService = documentStatusService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody DocumentStatusRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(documentStatusService.create(request));
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<DocumentStatusResponse>> getAll() {
        return ResponseEntity.ok(documentStatusService.getAll());
    }

    @GetMapping("/by-name")
    public ResponseEntity<?> getByName(@RequestParam String name) {
        try {
            return ResponseEntity.ok(documentStatusService.getByName(name));
        } catch (BusinessException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
