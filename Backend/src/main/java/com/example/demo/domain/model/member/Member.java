package com.example.demo.domain.model.member;

import com.example.demo.domain.model.department.Department;
import com.example.demo.domain.model.role.Role;
import com.example.demo.domain.enums.ApprovalStatusEnum;
import com.example.demo.domain.enums.GenderEnum;
import com.example.demo.domain.enums.GraduatedStatusEnum;
import com.example.demo.domain.enums.DocumentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.DynamicInsert;
import java.time.LocalDateTime;
import java.time.LocalDate;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@DynamicUpdate
@SQLRestriction("deleted_at IS NULL")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "student_id", nullable = false, unique = true, length = 50)
    private String studentId;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10)
    private GenderEnum gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "graduated_status", length = 50)
    private GraduatedStatusEnum graduatedStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "req_status", length = 50)
    private ApprovalStatusEnum reqStatus;

    @Column(name = "approval_note", length = 500)
    private String approvalNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Member approver;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}