package com.example.demo.application.service.Implementation.member;

import com.example.demo.application.dto.request.member.JoinClubRequest;
import com.example.demo.application.dto.request.member.ApprovalRequest;
import com.example.demo.application.dto.response.member.MemberResponse;
import com.example.demo.application.mapper.member.MemberMapper;
import com.example.demo.application.service.Interface.member.MemberUseCase;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.model.member.MemberApproval;
import com.example.demo.domain.model.department.Department;
import com.example.demo.domain.repository.member.MemberRepository;
import com.example.demo.domain.repository.member.MemberApprovalRepository;
import com.example.demo.domain.repository.department.DepartmentRepository;
import com.example.demo.domain.enums.ApprovalStatusEnum;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MemberService implements MemberUseCase {
    
    private final MemberRepository memberRepository;
    private final MemberApprovalRepository memberApprovalRepository;
    private final DepartmentRepository departmentRepository;
    private final MemberMapper memberMapper;

    public MemberService(MemberRepository memberRepository,
                         MemberApprovalRepository memberApprovalRepository,
                         DepartmentRepository departmentRepository,
                         MemberMapper memberMapper) {
        this.memberRepository = memberRepository;
        this.memberApprovalRepository = memberApprovalRepository;
        this.departmentRepository = departmentRepository;
        this.memberMapper = memberMapper;
    }

    @Override
    public MemberResponse registerMember(JoinClubRequest request) {
        // Validation
        validateJoinClubRequest(request);
        
        // Check if student already exists
        if (memberRepository.existsByStudentId(request.getStudentId())) {
            throw new IllegalArgumentException("Student ID already exists");
        }
        
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Get department
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        
        // Map to entity
        Member member = memberMapper.toEntity(request);
        member.setDepartment(department);
        member.setReqStatus(ApprovalStatusEnum.PENDING);
        
        // Save member
        Member savedMember = memberRepository.save(member);
        
        // Create approval record
        MemberApproval approval = MemberApproval.builder()
                .member(savedMember)
                .status(ApprovalStatusEnum.PENDING)
                .build();
        memberApprovalRepository.save(approval);
        
        return memberMapper.toResponse(savedMember);
    }

    @Override
    public MemberResponse approveMember(ApprovalRequest request) {
        // Validation
        validateApprovalRequest(request);
        
        // Get member
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        
        // Get approver
        Member approver = memberRepository.findById(request.getApprovedBy())
                .orElseThrow(() -> new IllegalArgumentException("Approver not found"));
        
        // Get approval record
        MemberApproval approval = memberApprovalRepository.findByMember(member)
                .orElseThrow(() -> new IllegalArgumentException("Approval record not found"));
        
        // Update approval
        approval.setStatus(request.getStatus());
        approval.setApprover(approver);
        approval.setApprovalDate(LocalDateTime.now());
        approval.setNote(request.getNote());
        memberApprovalRepository.save(approval);
        
        // Update member status
        member.setReqStatus(request.getStatus());
        Member updatedMember = memberRepository.save(member);
        
        return memberMapper.toResponse(updatedMember);
    }

    @Override
    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll()
                .stream()
                .map(memberMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MemberResponse getMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        return memberMapper.toResponse(member);
    }

    // Validation methods
    private void validateJoinClubRequest(JoinClubRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        
        if (request.getStudentId() == null || request.getStudentId().isBlank()) {
            throw new IllegalArgumentException("Student ID is required");
        }
        
        if (request.getFullName() == null || request.getFullName().isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }
        
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (request.getDepartmentId() == null) {
            throw new IllegalArgumentException("Department ID is required");
        }
        
        if (request.getGender() == null || request.getGender().isBlank()) {
            throw new IllegalArgumentException("Gender is required");
        }
        
        if (request.getDateOfBirth() == null) {
            throw new IllegalArgumentException("Date of birth is required");
        }
    }

    private void validateApprovalRequest(ApprovalRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Approval request cannot be null");
        }
        
        if (request.getMemberId() == null) {
            throw new IllegalArgumentException("Member ID is required");
        }
        
        if (request.getApprovedBy() == null) {
            throw new IllegalArgumentException("Approver ID is required");
        }
        
        if (request.getStatus() == null) {
            throw new IllegalArgumentException("Status is required");
        }
        
        if (request.getNote() != null && request.getNote().length() > 500) {
            throw new IllegalArgumentException("Note cannot exceed 500 characters");
        }
    }
}