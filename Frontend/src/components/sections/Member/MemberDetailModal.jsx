import styles from './MemberDetailModal.module.css';

export default function MemberDetailModal({ member, onClose }) {
  if (!member) return null;

  const rows = [
    ['MSSV', member.id],
    ['Họ và tên', member.name],
    ['Email', member.email],
    ['Số điện thoại', member.phone || 'Chưa cập nhật'],
    ['Khoa', member.department],
    ['Khóa', member.course],
    ['Ngày sinh', member.dateOfBirth || 'Chưa cập nhật'],
    ['Giới tính', member.gender],
    ['Tình trạng tốt nghiệp', member.graduationStatus],
    ['Vai trò', member.role],
    ['Trạng thái hồ sơ', member.requestStatus],
    ['Ngày đăng ký', member.registeredAt],
    ['Người xét duyệt', member.reviewedBy || 'Chưa xử lý'],
    ['Ngày xét duyệt', member.reviewedAt || 'Chưa xử lý'],
    ['Ghi chú', member.reviewNote || 'Không có'],
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalEyebrow}>Chi tiết hồ sơ</p>
            <h2>{member.name}</h2>
          </div>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Đóng">×</button>
        </div>
        <div className={styles.detailGrid}>
          {rows.map(([label, value]) => (
            <div className={styles.detailItem} key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
