package com.example.demo.domain.repository.subject;

import com.example.demo.domain.model.subject.Subject;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    Optional<Subject> findBySubjectName(String subjectName);

    boolean existsBySubjectNameIgnoreCase(String subjectName);
}
