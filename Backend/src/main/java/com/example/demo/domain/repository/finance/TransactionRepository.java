package com.example.demo.domain.repository.finance;

import com.example.demo.domain.enums.TransactionType;
import com.example.demo.domain.model.finance.Transaction;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    @EntityGraph(attributePaths = {"event", "member", "createdBy", "approvedBy"})
    Optional<Transaction> findById(String transactionId);

    @EntityGraph(attributePaths = {"event", "member", "createdBy", "approvedBy"})
    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.deletedAt IS NULL
            ORDER BY t.createdAt DESC
            """)
    List<Transaction> findActive();

    @EntityGraph(attributePaths = {"event", "member", "createdBy", "approvedBy"})
    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.deletedAt IS NULL
              AND t.type = :type
            ORDER BY t.createdAt DESC
            """)
    List<Transaction> findActiveByType(@Param("type") TransactionType type);

    @EntityGraph(attributePaths = {"event", "member", "createdBy", "approvedBy"})
    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.deletedAt IS NULL
              AND t.event.eventId = :eventId
            ORDER BY t.createdAt DESC
            """)
    List<Transaction> findActiveByEventId(@Param("eventId") String eventId);

    @EntityGraph(attributePaths = {"event", "member", "createdBy", "approvedBy"})
    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.deletedAt IS NULL
              AND t.type = :type
              AND t.event.eventId = :eventId
            ORDER BY t.createdAt DESC
            """)
    List<Transaction> findActiveByTypeAndEventId(
            @Param("type") TransactionType type, @Param("eventId") String eventId);

    @EntityGraph(attributePaths = {"event", "member", "createdBy", "approvedBy"})
    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.deletedAt IS NULL
              AND t.createdAt BETWEEN :from AND :to
            ORDER BY t.createdAt DESC
            """)
    List<Transaction> findActiveByCreatedAtBetween(
            @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @EntityGraph(attributePaths = {"event", "member", "createdBy", "approvedBy"})
    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.deletedAt IS NULL
              AND t.type = :type
              AND t.createdAt BETWEEN :from AND :to
            ORDER BY t.createdAt DESC
            """)
    List<Transaction> findActiveByTypeAndCreatedAtBetween(
            @Param("type") TransactionType type,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    boolean existsByEventEventId(String eventId);

    boolean existsByMemberMemberId(Long memberId);

    boolean existsByCreatedByMemberId(Long memberId);

    boolean existsByApprovedByMemberId(Long memberId);
}
