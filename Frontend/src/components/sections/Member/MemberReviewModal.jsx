import { useState } from 'react';

import styles from './MemberReviewModal.module.css';


const TODAY = new Date().toISOString().slice(0, 10);

export default function MemberReviewModal({
  member,
  type,
  onClose,
  onConfirm,
  loading = false,
  serverError = '',
}) {
  const [reviewedBy, setReviewedBy] = useState('Admin CLB');
  const [reviewedAt, setReviewedAt] = useState(TODAY);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!member) return null;

  const isReject = type === 'reject';
  const title = isReject ? 'Từ chối hồ sơ thành viên' : 'Duyệt hồ sơ thành viên';

  const submit = (e) => {
    e.preventDefault();
    if (!reviewedBy.trim()) {
      setError('Vui lòng nhập người xét duyệt');
      return;
    }
    if (!reviewedAt) {
      setError('Vui lòng chọn ngày xét duyệt');
      return;
    }
    if (reviewedAt < member.registeredAt) {
      setError('Ngày xét duyệt phải lớn hơn hoặc bằng ngày đăng ký');
      return;
    }
    if (isReject && !note.trim()) {
      setError('Vui lòng nhập lý do từ chối');
      return;
    }
    onConfirm(member, {
      requestStatus: isReject ? 'Từ chối' : 'Đã duyệt',
      reviewedBy: reviewedBy.trim(),
      reviewedAt,
      reviewNote: note.trim() || (isReject ? 'Hồ sơ bị từ chối.' : 'Hồ sơ hợp lệ.'),
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <form className={styles.reviewModal} onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalEyebrow}>Xét duyệt hồ sơ</p>
            <h2>{title}</h2>
          </div>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Đóng">×</button>
        </div>
        <p className={styles.reviewIntro}>
          Hồ sơ <strong>{member.id}</strong> - {member.name}
        </p>
        <label className={styles.reviewField}>
          Người xét duyệt
          <input value={reviewedBy} onChange={(e) => setReviewedBy(e.target.value)} />
        </label>
        <label className={styles.reviewField}>
          Ngày xét duyệt
          <input type="date" value={reviewedAt} onChange={(e) => setReviewedAt(e.target.value)} />
        </label>
        <label className={styles.reviewField}>
          {isReject ? 'Lý do từ chối' : 'Ghi chú'}
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={isReject ? 'Nhập lý do từ chối hồ sơ...' : 'Ghi chú xét duyệt nếu có...'} />
        </label>
        {(error || serverError) && <p className={styles.reviewError}>{error || serverError}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryBtn} onClick={onClose} disabled={loading}>Hủy</button>
          <button type="submit" className={isReject ? styles.dangerBtn : styles.primaryBtn} disabled={loading}>
            {loading ? 'Đang xử lý...' : isReject ? 'Xác nhận từ chối' : 'Xác nhận duyệt'}
          </button>
        </div>
      </form>
    </div>
  );
}

