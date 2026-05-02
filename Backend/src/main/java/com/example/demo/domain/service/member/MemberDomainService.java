package com.example.demo.domain.service.member;

import com.example.demo.domain.enums.ApprovalStatusEnum;
import com.example.demo.domain.enums.GraduatedStatusEnum;
import com.example.demo.domain.enums.GenderEnum;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.model.member.MemberApproval;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MemberDomainService {

    // ==================== QĐ1: Validate đăng ký ====================

    // QĐ1.1: Phải là sinh viên chưa tốt nghiệp
    public void validateNotGraduated(GraduatedStatusEnum status) {
        if (status == null) {
            throw new IllegalArgumentException("Tình trạng tốt nghiệp không được để trống");
        }
        if (status == GraduatedStatusEnum.GRADUATED) {
            throw new IllegalArgumentException("Chỉ sinh viên chưa tốt nghiệp mới được đăng ký");
        }
    }

    // QĐ1.2: Format MSSV hợp lệ
    public void validateStudentIdFormat(String studentId) {
        if (studentId == null || studentId.isBlank()) {
            throw new IllegalArgumentException("MSSV không được để trống");
        }
        if (!studentId.matches("^[0-9]{8,12}$")) {
            throw new IllegalArgumentException("MSSV không hợp lệ, phải là 8-12 chữ số");
        }
    }

    // QĐ1.2: Format Email hợp lệ
    public void validateEmailFormat(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        if (!email.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }
    }

    // QĐ1.5: Trạng thái mặc định khi tạo member phải là PENDING
    public void validateDefaultStatus(ApprovalStatusEnum status) {
        if (status != ApprovalStatusEnum.PENDING) {
            throw new IllegalArgumentException("Trạng thái hồ sơ mới phải là PENDING");
        }
    }

    // QĐ1.6: Giới tính chỉ được là MALE hoặc FEMALE
    public void validateGender(GenderEnum gender) {
        if (gender == null) {
            throw new IllegalArgumentException("Giới tính không được để trống");
        }
        if (gender == GenderEnum.OTHER) {
            throw new IllegalArgumentException("Giới tính chỉ được là Nam hoặc Nữ");
        }
    }

    // ==================== QĐ2: Validate xét duyệt ====================

    // QĐ2.1: Người xét duyệt phải có quyền (priority <= 2)
    public void validateApproverPermission(Member approver) {
        if (approver.getRole() == null) {
            throw new IllegalArgumentException("Người xét duyệt chưa được phân quyền");
        }
        if (approver.getRole().getPriority() > 2) {
            throw new IllegalArgumentException("Người xét duyệt không có quyền thực hiện thao tác này");
        }
    }

    // QĐ2.3: Không cho phép duyệt lại nếu đã có kết quả chính thức
    public void validateApprovalNotFinalized(MemberApproval approval) {
        if (approval.getStatus() != ApprovalStatusEnum.PENDING) {
            throw new IllegalArgumentException("Hồ sơ này đã được xét duyệt, không thể thay đổi");
        }
    }

    // QĐ2.4: Kết quả chỉ được là APPROVED hoặc REJECTED
    public void validateApprovalStatus(ApprovalStatusEnum status) {
        if (status == null) {
            throw new IllegalArgumentException("Kết quả xét duyệt không được để trống");
        }
        if (status == ApprovalStatusEnum.PENDING) {
            throw new IllegalArgumentException("Kết quả xét duyệt phải là 'Đã duyệt' hoặc 'Từ chối'");
        }
    }

    // QĐ2.5: Ngày xét duyệt phải >= ngày tạo hồ sơ
    public void validateApprovalDate(Member member) {
        if (member.getCreatedAt() != null &&
                LocalDateTime.now().isBefore(member.getCreatedAt())) {
            throw new IllegalArgumentException("Ngày xét duyệt không được trước ngày tạo hồ sơ");
        }
    }

    // ==================== Logic nghiệp vụ ====================

    // Kiểm tra member có thể được cập nhật không
    public void validateCanUpdate(Member member) {
        if (member.getReqStatus() == ApprovalStatusEnum.APPROVED) {
            throw new IllegalArgumentException("Không thể cập nhật thông tin thành viên đã được duyệt");
        }
    }

    // Apply kết quả xét duyệt lên MemberApproval
    public void applyApproval(MemberApproval approval,
                               ApprovalStatusEnum status,
                               Member approver,
                               String note) {
        approval.setStatus(status);
        approval.setApprover(approver);
        approval.setApprovalDate(LocalDateTime.now());
        approval.setNote(note);
    }
}