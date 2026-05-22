package com.example.demo.controller.finance;

import com.example.demo.application.dto.request.finance.TransactionRequest;
import com.example.demo.application.dto.response.finance.TransactionResponse;
import com.example.demo.application.service.finance.interfaces.TransactionService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody TransactionRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAll() {
        return ResponseEntity.ok(transactionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(transactionService.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/by-type")
    public ResponseEntity<List<TransactionResponse>> byType(@RequestParam String type) {
        return ResponseEntity.ok(transactionService.getByType(type));
    }

    @GetMapping("/by-event/{eventId}")
    public ResponseEntity<List<TransactionResponse>> byEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(transactionService.getByEvent(eventId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            transactionService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
