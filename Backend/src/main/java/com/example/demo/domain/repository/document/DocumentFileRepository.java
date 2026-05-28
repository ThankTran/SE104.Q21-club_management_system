package com.example.demo.domain.repository.document;

import com.example.demo.domain.model.document.DocumentFile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentFileRepository extends JpaRepository<DocumentFile, Long> {
    List<DocumentFile> findByDocumentDocumentId(Long documentId);

    Optional<DocumentFile> findFirstByDocumentDocumentIdOrderByUploadedAtAsc(Long documentId);

    boolean existsByDocumentDocumentId(Long documentId);
}
