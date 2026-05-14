package com.example.demo.domain.repository.document;

import com.example.demo.domain.model.document.DocumentFile;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentFileRepository extends JpaRepository<DocumentFile, Long> {
    List<DocumentFile> findByDocumentDocumentId(Long documentId);

    boolean existsByDocumentDocumentId(Long documentId);
}
