import styles from './EventRegistrationModal.module.css';

export default function EventRegistrationModal({ event, members, onClose }) {
  if (!event) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Danh sách thành viên đăng ký</h3>
            <p className={styles.meta}>{event.eventCode} · {event.title}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Đóng">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className={styles.summary}>
          <span>Đã đăng ký</span>
          <strong>{members.length.toLocaleString('vi-VN')}</strong>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã thành viên</th>
                <th>Họ tên</th>
                <th>Lớp</th>
                <th>Email</th>
                <th>Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.id}>
                    <td className={styles.codeCell}>{member.memberCode}</td>
                    <td>{member.name}</td>
                    <td>{member.className}</td>
                    <td>{member.email}</td>
                    <td>{member.registeredAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className={styles.emptyCell} colSpan={5}>Chưa có thành viên đăng ký</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
