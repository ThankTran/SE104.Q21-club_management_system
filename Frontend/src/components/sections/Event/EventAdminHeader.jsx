import styles from './EventAdminHeader.module.css';

export default function EventAdminHeader({ onExport, onAdd, onOpenEvaluationList }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>Quản lý Sự kiện</h1>
        <p className={styles.pageSubtitle}>Tổ chức, theo dõi và quản lý các sự kiện học thuật của câu lạc bộ.</p>
      </div>
      <div className={styles.headerActions}>
        <button className={styles.historyBtn} onClick={onOpenEvaluationList}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v5l3 3"/>
            <path d="M3.05 11a9 9 0 101.64-4.36L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Đánh giá
        </button>
        <button className={styles.exportBtn} onClick={onExport}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Xuất dữ liệu
        </button>
        <button className={styles.addBtn} onClick={onAdd}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Sự kiện mới
        </button>
      </div>
    </div>
  );
}
