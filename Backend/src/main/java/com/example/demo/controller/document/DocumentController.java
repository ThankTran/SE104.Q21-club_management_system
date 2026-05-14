package com.example.demo.controller.document;

import com.example.demo.application.dto.request.document.DocumentRequest;
import com.example.demo.application.dto.response.document.DocumentResponse;
import com.example.demo.application.exception.BusinessException;
import com.example.demo.application.service.interfaces.document.DocumentService;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody DocumentRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(documentService.create(request));
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getAll() {
        return ResponseEntity.ok(documentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(documentService.getById(id));
        } catch (BusinessException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<DocumentResponse>> search(@RequestParam String name) {
        return ResponseEntity.ok(documentService.searchByName(name));
    }

    @GetMapping("/by-subject/{subjectId}")
    public ResponseEntity<List<DocumentResponse>> bySubject(@PathVariable Integer subjectId) {
        return ResponseEntity.ok(documentService.getBySubject(subjectId));
    }

    @GetMapping("/by-type/{typeId}")
    public ResponseEntity<List<DocumentResponse>> byType(@PathVariable Integer typeId) {
        return ResponseEntity.ok(documentService.getByType(typeId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        documentService.softDeleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<?> hardDelete(@PathVariable Long id) {
        try {
            documentService.hardDeleteById(id);
            return ResponseEntity.noContent().build();
        } catch (BusinessException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
