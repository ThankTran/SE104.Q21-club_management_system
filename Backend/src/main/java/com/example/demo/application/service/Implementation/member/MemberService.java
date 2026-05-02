package com.example.demo.application.service.Implementation.member;

import com.example.demo.application.dto.request.member.JoinClubRequest;
import com.example.demo.application.dto.request.member.ApprovalRequest;
import com.example.demo.application.dto.request.member.MemberSearchRequest;
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
import com.example.demo.domain.enums.GenderEnum;
import com.example.demo.domain.service.member.MemberDomainService;

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
    private final MemberDomainService memberDomainService; 

    public MemberService(MemberRepository memberRepository,
                         MemberApprovalRepository memberApprovalRepository,
                         DepartmentRepository departmentRepository,
                         MemberMapper memberMapper,
                         MemberDomainService memberDomainService) {
        this.memberRepository = memberRepository;
        this.memberApprovalRepository = memberApprovalRepository;
        this.departmentRepository = departmentRepository;
        this.memberMapper = memberMapper;
        this.memberDomainService = memberDomainService;
    }

    // ==================== BM1: Tạo phiếu đăng ký ====================
    @Override
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

        // QĐ1.5: Validate trạng thái mặc định
        memberDomainService.validateDefaultStatus(member.getReqStatus());

        Member savedMember = memberRepository.save(member);

        // Tạo phiếu xét duyệt
        MemberApproval approval = MemberApproval.builder()
                .member(savedMember)
                .status(ApprovalStatusEnum.PENDING)
                .build();
        memberApprovalRepository.save(approval);

        return memberMapper.toResponse(savedMember);
    }

    // ==================== BM2: Xét duyệt ====================
    @Override
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

        // QĐ2.2: Lấy phiếu xét duyệt
        MemberApproval approval = memberApprovalRepository.findByMember(member)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu xét duyệt"));

        // QĐ2.3: Không duyệt lại
        memberDomainService.validateApprovalNotFinalized(approval);

        // QĐ2.5: Validate ngày
        memberDomainService.validateApprovalDate(member);

        // Validate note
        if (request.getNote() != null && request.getNote().length() > 500)
            throw new IllegalArgumentException("Ghi chú không được vượt quá 500 ký tự");

        memberDomainService.applyApproval(
                approval,
                request.getStatus(),
                approver,
                request.getNote()
        );
        memberApprovalRepository.save(approval);

        member.setReqStatus(request.getStatus());
        Member updatedMember = memberRepository.save(member);

        return memberMapper.toResponse(updatedMember);
    }

    // ==================== BM3: Tra cứu ====================
    @Override
    public List<MemberResponse> searchMembers(MemberSearchRequest request) {
        return memberRepository.findAll().stream()
                .filter(m -> request.getFullName() == null || request.getFullName().isBlank()
                        || m.getFullName().toLowerCase()
                                .contains(request.getFullName().toLowerCase()))
                .filter(m -> request.getStudentId() == null || request.getStudentId().isBlank()
                        || m.getStudentId().equalsIgnoreCase(request.getStudentId()))
                .filter(m -> request.getDepartmentId() == null
                        || (m.getDepartment() != null &&
                                m.getDepartment().getDepartmentId().equals(request.getDepartmentId())))
                .filter(m -> request.getReqStatus() == null
                        || m.getReqStatus() == request.getReqStatus())
                .filter(m -> request.getGraduatedStatus() == null
                        || m.getGraduatedStatus() == request.getGraduatedStatus())
                .map(memberMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(memberMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MemberResponse getMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thành viên với ID: " + memberId));
        return memberMapper.toResponse(member);
    }

    @Override
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

        return memberMapper.toResponse(memberRepository.save(member));
    }
}