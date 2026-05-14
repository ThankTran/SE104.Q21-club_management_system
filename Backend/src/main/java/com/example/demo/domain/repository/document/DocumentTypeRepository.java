package com.example.demo.domain.repository.document;

import com.example.demo.domain.model.document.DocumentType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, Integer> {
    Optional<DocumentType> findByTypeNameIgnoreCase(String typeName);
}
