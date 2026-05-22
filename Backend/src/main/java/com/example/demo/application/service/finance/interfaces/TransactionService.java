package com.example.demo.application.service.finance.interfaces;

import com.example.demo.application.dto.request.finance.TransactionRequest;
import com.example.demo.application.dto.response.finance.TransactionResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface TransactionService {
    TransactionResponse create(TransactionRequest request);

    List<TransactionResponse> getAll();

    List<TransactionResponse> getByType(String type);

    List<TransactionResponse> getByEvent(String eventId);

    TransactionResponse getById(String id);

    void delete(String id);

    CompletableFuture<List<TransactionResponse>> getAllAsync();
}
