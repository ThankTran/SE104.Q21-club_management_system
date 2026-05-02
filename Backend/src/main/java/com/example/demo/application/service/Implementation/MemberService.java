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
import com.example.demo.domain.enums.GraduatedStatusEnum;

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

    // ==================== BM1: Tạo phiếu đăng ký ====================
    @Override
    public MemberResponse registerMember(JoinClubRequest request) {
        validateJoinClubRequest(request);

        // QĐ1.1: Phải là sinh viên chưa tốt nghiệp
        if (request.getGraduatedStatus() == GraduatedStatusEnum.GRADUATED) {
            throw new IllegalArgumentException("Chỉ sinh viên chưa tốt nghiệp mới được đăng ký");
        }

        // QĐ1.2: MSSV và Email không được trùng
        if (memberRepository.existsByStudentId(request.getStudentId())) {
            throw new IllegalArgumentException("MSSV đã tồn tại trong hệ thống");
        }
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống");
        }

        // QĐ1.3: Khoa phải hợp lệ
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Khoa không tồn tại trong hệ thống"));

        Member member = memberMapper.toEntity(request);
        member.setDepartment(department);

        // QĐ1.5: Trạng thái hồ sơ mặc định là PENDING
        member.setReqStatus(ApprovalStatusEnum.PENDING);
        member.setCreatedAt(LocalDateTime.now());

        Member savedMember = memberRepository.save(member);

        // Tạo phiếu xét duyệt đi kèm
        MemberApproval approval = MemberApproval.builder()
                .member(savedMember)
                .status(ApprovalStatusEnum.PENDING)
                .build();
        memberApprovalRepository.save(approval);

        return memberMapper.toResponse(savedMember);
    }

    // ==================== BM2: Xét duyệt phiếu đăng ký ====================
    @Override
    public MemberResponse approveMember(ApprovalRequest request) {
        validateApprovalRequest(request);

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ thành viên"));

        // QĐ2.1: Người xét duyệt phải có quyền (role_id ưu tiên cao - priority thấp)
        Member approver = memberRepository.findById(request.getApprovedBy())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người xét duyệt"));

        if (approver.getRole() == null || approver.getRole().getPriority() > 2) {
            throw new IllegalArgumentException("Người xét duyệt không có quyền thực hiện thao tác này");
        }

        // QĐ2.2: Phải tìm được đúng 1 phiếu xét duyệt liên kết
        MemberApproval approval = memberApprovalRepository.findByMember(member)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu xét duyệt"));

        // QĐ2.3: Không cho phép duyệt lại nếu đã có kết quả chính thức
        if (approval.getStatus() != ApprovalStatusEnum.PENDING) {
            throw new IllegalArgumentException("Hồ sơ này đã được xét duyệt, không thể thay đổi");
        }

        // QĐ2.4: Status chỉ được là APPROVED hoặc REJECTED
        if (request.getStatus() == ApprovalStatusEnum.PENDING) {
            throw new IllegalArgumentException("Kết quả xét duyệt phải là 'Đã duyệt' hoặc 'Từ chối'");
        }

        // QĐ2.5: Ngày xét duyệt phải >= ngày tạo hồ sơ
        if (member.getCreatedAt() != null &&
                LocalDateTime.now().isBefore(member.getCreatedAt())) {
            throw new IllegalArgumentException("Ngày xét duyệt không hợp lệ");
        }

        approval.setStatus(request.getStatus());
        approval.setApprover(approver);
        approval.setApprovalDate(LocalDateTime.now());
        approval.setNote(request.getNote());
        memberApprovalRepository.save(approval);

        member.setReqStatus(request.getStatus());
        Member updatedMember = memberRepository.save(member);

        return memberMapper.toResponse(updatedMember);
    }

    // ==================== BM3: Tra cứu thành viên ====================
    @Override
    public List<MemberResponse> searchMembers(MemberSearchRequest request) {
        List<Member> members = memberRepository.findAll();

        return members.stream()
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

    // ==================== Các method hỗ trợ ====================
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
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thành viên với ID: " + memberId));
        return memberMapper.toResponse(member);
    }

    @Override
    public MemberResponse updateMember(Long memberId, JoinClubRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thành viên với ID: " + memberId));

        // Không cho cập nhật nếu đã được duyệt
        if (member.getReqStatus() == ApprovalStatusEnum.APPROVED) {
            throw new IllegalArgumentException("Không thể cập nhật thông tin thành viên đã được duyệt");
        }

        // Validate email nếu thay đổi
        if (!member.getEmail().equals(request.getEmail())
                && memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống");
        }

        // Validate department
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Khoa không tồn tại"));

        member.setFullName(request.getFullName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        member.setGender(request.getGender());
        member.setDateOfBirth(request.getDateOfBirth());
        member.setDepartment(department);
        member.setGraduatedStatus(request.getGraduatedStatus());

        return memberMapper.toResponse(memberRepository.save(member));
    }

    // ==================== Validation ====================
    private void validateJoinClubRequest(JoinClubRequest request) {
        if (request == null) throw new IllegalArgumentException("Request không được null");

        if (request.getStudentId() == null || request.getStudentId().isBlank())
            throw new IllegalArgumentException("MSSV không được để trống");

        // QĐ1.2: Validate format MSSV (ví dụ: bắt đầu bằng số, đủ ký tự)
        if (!request.getStudentId().matches("^[0-9]{8,12}$"))
            throw new IllegalArgumentException("MSSV không hợp lệ");

        if (request.getFullName() == null || request.getFullName().isBlank())
            throw new IllegalArgumentException("Họ tên không được để trống");

        if (request.getEmail() == null || request.getEmail().isBlank())
            throw new IllegalArgumentException("Email không được để trống");

        // QĐ1.2: Validate format Email
        if (!request.getEmail().matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$"))
            throw new IllegalArgumentException("Email không hợp lệ");

        if (request.getDepartmentId() == null)
            throw new IllegalArgumentException("Khoa không được để trống");

        // QĐ1.6: Gender chỉ được là Nam hoặc Nữ
        if (request.getGender() == null)
            throw new IllegalArgumentException("Giới tính không được để trống");

        if (request.getDateOfBirth() == null)
            throw new IllegalArgumentException("Ngày sinh không được để trống");

        // QĐ1.4: GraduatedStatus chỉ được là 2 giá trị
        if (request.getGraduatedStatus() == null)
            throw new IllegalArgumentException("Tình trạng tốt nghiệp không được để trống");
    }

    private void validateApprovalRequest(ApprovalRequest request) {
        if (request == null) throw new IllegalArgumentException("Approval request không được null");

        if (request.getMemberId() == null)
            throw new IllegalArgumentException("Member ID không được để trống");

        if (request.getApprovedBy() == null)
            throw new IllegalArgumentException("Approver ID không được để trống");

        // QĐ2.4: Status phải là APPROVED hoặc REJECTED
        if (request.getStatus() == null)
            throw new IllegalArgumentException("Kết quả xét duyệt phải là 'Đã duyệt' hoặc 'Từ chối'");

        if (request.getNote() != null && request.getNote().length() > 500)
            throw new IllegalArgumentException("Ghi chú không được vượt quá 500 ký tự");
    }
}