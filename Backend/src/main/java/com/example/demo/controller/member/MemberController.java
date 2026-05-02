package com.example.demo.controller.member;

import com.example.demo.application.dto.request.member.CreateMemberRequest;
import com.example.demo.application.dto.request.member.ApprovalRequest;
import com.example.demo.application.dto.request.member.MemberSearchRequest;
import com.example.demo.application.dto.response.member.MemberResponse;
import com.example.demo.application.dto.response.member.MemberApprovalResponse;
import com.example.demo.application.dto.response.member.MemberSearchResponse;
import com.example.demo.application.dto.response.department.DepartmentResponse;
import com.example.demo.application.service.Interface.member.MemberUseCase;
import com.example.demo.domain.repository.department.DepartmentRepository;
import com.example.demo.application.mapper.member.MemberMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberUseCase memberUseCase;
    private final DepartmentRepository departmentRepository;
    private final MemberMapper memberMapper;

    public MemberController(MemberUseCase memberUseCase,
                            DepartmentRepository departmentRepository,
                            MemberMapper memberMapper) {
        this.memberUseCase = memberUseCase;
        this.departmentRepository = departmentRepository;
        this.memberMapper = memberMapper;
    }

    // ==================== BM1: Tạo phiếu đăng ký ====================
    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody CreateMemberRequest request) {
        try {
            MemberResponse response = memberUseCase.registerMember(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== BM2: Xét duyệt ====================
    @PostMapping("/approve")
    public ResponseEntity<?> approveMember(@RequestBody ApprovalRequest request) {
        try {
            MemberApprovalResponse response = memberUseCase.approveMember(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== BM3: Tra cứu ====================
    @GetMapping("/search")
    public ResponseEntity<?> searchMembers(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String reqStatus,
            @RequestParam(required = false) String graduatedStatus) {
        try {
            MemberSearchRequest searchRequest = MemberSearchRequest.builder()
                    .fullName(fullName)
                    .studentId(studentId)
                    .departmentId(departmentId)
                    .reqStatus(reqStatus != null
                            ? com.example.demo.domain.enums.ApprovalStatusEnum.valueOf(reqStatus.toUpperCase())
                            : null)
                    .graduatedStatus(graduatedStatus != null
                            ? com.example.demo.domain.enums.GraduatedStatusEnum.valueOf(graduatedStatus.toUpperCase())
                            : null)
                    .build();

            List<MemberSearchResponse> response = memberUseCase.searchMembers(searchRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== Lấy tất cả thành viên ====================
    @GetMapping
    public ResponseEntity<?> getAllMembers() {
        try {
            List<MemberResponse> response = memberUseCase.getAllMembers();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== Lấy thành viên theo ID ====================
    @GetMapping("/{id}")
    public ResponseEntity<?> getMemberById(@PathVariable Long id) {
        try {
            MemberResponse response = memberUseCase.getMemberById(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ==================== Cập nhật thành viên ====================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(@PathVariable Long id,
                                          @RequestBody CreateMemberRequest request) {
        try {
            MemberResponse response = memberUseCase.updateMember(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== Lấy danh sách khoa ====================

    @GetMapping("/departments")
    public ResponseEntity<?> getAllDepartments() {
        try {
            List<DepartmentResponse> response = departmentRepository.findAll()
                    .stream()
                    .map(memberMapper::toDepartmentResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}