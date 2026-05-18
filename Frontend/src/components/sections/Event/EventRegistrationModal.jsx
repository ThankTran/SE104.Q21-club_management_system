import styles from './EventRegistrationModal.module.css';

export default function EventRegistrationModal({ event, members, onClose, onExport }) {
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
          <div>
            <span>Đã đăng ký</span>
            <strong>{members.length.toLocaleString('vi-VN')}</strong>
          </div>
          <button className={styles.exportBtn} onClick={onExport} disabled={!members.length}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Xuất file
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>MSSV</th>
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
