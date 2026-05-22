package com.example.demo.application.service.member.impl;

import com.example.demo.application.dto.request.member.JoinClubRequest;
import com.example.demo.application.dto.request.member.ApprovalRequest;
import com.example.demo.application.dto.request.member.MemberSearchRequest;
import com.example.demo.application.dto.response.member.MemberResponse;
import com.example.demo.application.mapper.member.MemberMapper;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.model.department.Department;
import com.example.demo.domain.repository.member.MemberRepository;
import com.example.demo.domain.repository.department.DepartmentRepository;
import com.example.demo.domain.enums.ApprovalStatusEnum;
import com.example.demo.domain.enums.GenderEnum;
import com.example.demo.domain.service.member.MemberDomainService;

import java.util.concurrent.CompletableFuture;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@CacheConfig(cacheNames = "members")
public class MemberServiceImpl implements com.example.demo.application.service.member.interfaces.MemberService {
    private static final int MIN_ROLE_PRIORITY = 1;
    private static final int MAX_ROLE_PRIORITY = 10;

    private final MemberRepository memberRepository;
    private final DepartmentRepository departmentRepository;
    private final MemberMapper memberMapper;
    private final MemberDomainService memberDomainService; 

    public MemberServiceImpl(MemberRepository memberRepository,
                             DepartmentRepository departmentRepository,
                             MemberMapper memberMapper,
                             MemberDomainService memberDomainService) {
        this.memberRepository = memberRepository;
        this.departmentRepository = departmentRepository;
        this.memberMapper = memberMapper;
        this.memberDomainService = memberDomainService;
    }

    // ==================== BM1: Tạo phiếu đăng ký ====================
    @Override
    @CacheEvict(allEntries = true)
    public MemberResponse registerMember(JoinClubRequest request) {

        // Validate format — domain service lo
        memberDomainService.validateStudentIdFormat(request.getStudentId());
        memberDomainService.validateEmailFormat(request.getEmail());
        memberDomainService.validateNotGraduated(request.getGraduatedStatus());
        memberDomainService.validateGender(
                GenderEnum.valueOf(request.getGender().toUpperCase())
        );

        if (memberRepository.existsByStudentId(request.getStudentId())) {
            throw new IllegalArgumentException("MSSV đã tồn tại trong hệ thống");
        }
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Khoa không tồn tại trong hệ thống"));

        Member member = memberMapper.toEntity(request);
        member.setDepartment(department);
        member.setReqStatus(ApprovalStatusEnum.PENDING);
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());

        // QĐ1.5: Validate trạng thái mặc định
        memberDomainService.validateDefaultStatus(member.getReqStatus());

        Member savedMember = memberRepository.save(member);
        return memberMapper.toResponse(savedMember);
    }

    // ==================== BM2: Xét duyệt ====================
    @Override
    @CacheEvict(allEntries = true)
    public MemberResponse approveMember(ApprovalRequest request) {

        // Validate request cơ bản
        if (request.getMemberId() == null)
            throw new IllegalArgumentException("Member ID không được để trống");
        if (request.getApprovedBy() == null)
            throw new IllegalArgumentException("Approver ID không được để trống");

        // QĐ2.4: Validate status
        memberDomainService.validateApprovalStatus(request.getStatus());

        // Lấy member
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ thành viên"));

        // QĐ2.1: Validate quyền approver
        Member approver = memberRepository.findById(request.getApprovedBy())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người xét duyệt"));
        memberDomainService.validateApproverPermission(approver);

        // QĐ2.3: Không duyệt lại
        memberDomainService.validateApprovalNotFinalized(member);

        // QĐ2.5: Validate ngày
        memberDomainService.validateApprovalDate(member);

        // Validate note
        if (request.getNote() != null && request.getNote().length() > 500)
            throw new IllegalArgumentException("Ghi chú không được vượt quá 500 ký tự");

        memberDomainService.applyApproval(member, request.getStatus(), approver, request.getNote());
        Member updatedMember = memberRepository.save(member);

        return memberMapper.toResponse(updatedMember);
    }

    // ==================== BM3: Tra cứu ====================
    @Override
    @Cacheable(key = "'search:' + (#request?.studentId ?: '') + '|' + (#request?.fullName ?: '') + '|' + (#request?.departmentId ?: '') + '|' + (#request?.reqStatus ?: '') + '|' + (#request?.graduatedStatus ?: '') + '|' + (#request?.rolePriority ?: '') + '|' + (#request?.rolePriorityGreaterThan ?: '') + '|p:' + #pageable.pageNumber + '|s:' + #pageable.pageSize + '|sort:' + #pageable.sort.toString()")
    public Page<MemberResponse> searchMembers(MemberSearchRequest request, Pageable pageable) {
        MemberSearchRequest safeRequest = request == null ? MemberSearchRequest.builder().build() : request;
        return filterMembers(safeRequest, pageable).map(memberMapper::toResponse);
    }

    private Page<Member> filterMembers(MemberSearchRequest request, Pageable pageable) {
        String studentId = normalizeSearchText(request.getStudentId());
        String fullName = normalizeSearchText(request.getFullName());
        validateRolePriorityFilter(request);

        return memberRepository.searchMembers(
                studentId,
                fullName,
                request.getDepartmentId(),
                request.getReqStatus(),
                request.getGraduatedStatus(),
                request.getRolePriority(),
                request.getRolePriorityGreaterThan(),
                pageable);
    }

    private void validateRolePriorityFilter(MemberSearchRequest request) {
        if (request.getRolePriority() == null) {
            return;
        }
        if (request.getRolePriority() < MIN_ROLE_PRIORITY || request.getRolePriority() > MAX_ROLE_PRIORITY) {
            throw new IllegalArgumentException("Role priority must be between 1 and 10");
        }
    }

    private String normalizeSearchText(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    @Override
    @Cacheable(key = "'all'")
    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(memberMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(key = "'id:' + #memberId")
    public MemberResponse getMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thành viên với ID: " + memberId));
        return memberMapper.toResponse(member);
    }

    @Override
    @CacheEvict(allEntries = true)
    public MemberResponse updateMember(Long memberId, JoinClubRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thành viên với ID: " + memberId));

        // Domain service kiểm tra có được update không
        memberDomainService.validateCanUpdate(member);

        // Validate email nếu thay đổi
        memberDomainService.validateEmailFormat(request.getEmail());
        if (!member.getEmail().equals(request.getEmail())
                && memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống");
        }

        // Validate department
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Khoa không tồn tại"));

        member.setFullName(request.getFullName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhoneNumber());
        member.setGender(GenderEnum.valueOf(request.getGender().toUpperCase()));
        member.setDateOfBirth(request.getDateOfBirth());
        member.setDepartment(department);
        member.setGraduatedStatus(request.getGraduatedStatus());
        member.setUpdatedAt(LocalDateTime.now());
        member.setApprovalNote("Thông tin được chỉnh sửa, chờ xét duyệt lại");

        if (member.getRole() != null && member.getRole().getPriority() != null
                && member.getRole().getPriority() == 1) {
            member.setReqStatus(ApprovalStatusEnum.APPROVED);
            member.setApprovalDate(LocalDateTime.now());
        } else {
            member.setReqStatus(ApprovalStatusEnum.PENDING);
            member.setApprovalDate(null);
        }

        return memberMapper.toResponse(memberRepository.save(member));
    }

    @Async("applicationTaskExecutor")
    public CompletableFuture<Page<MemberResponse>> searchMembersAsync(MemberSearchRequest request, Pageable pageable) {
        return CompletableFuture.completedFuture(searchMembers(request, pageable));
    }

    @Async("applicationTaskExecutor")
    public CompletableFuture<List<MemberResponse>> getAllMembersAsync() {
        return CompletableFuture.completedFuture(getAllMembers());
    }

    @Async("applicationTaskExecutor")
    public CompletableFuture<MemberResponse> getMemberByIdAsync(Long memberId) {
        return CompletableFuture.completedFuture(getMemberById(memberId));
    }
}
