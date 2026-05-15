import styles from './ResourceAdminHeader.module.css';

export default function ResourceAdminHeader({ onAddResource, onOpenHistory, historyActive }) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Quản lý kho tài liệu học thuật</h1>
        <p className={styles.subtitle}>
          Lập phiếu thêm tài liệu, xét duyệt và tra cứu tài liệu trong câu lạc bộ.
        </p>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.secondaryBtn} ${historyActive ? styles.secondaryBtnActive : ''}`}
          onClick={onOpenHistory}
        >
          <svg className={styles.btnIcon} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
            <path d="M12 7v5l3 2" />
          </svg>
          Lịch sử
        </button>
        <button type="button" className={styles.primaryBtn} onClick={onAddResource}>
          + Thêm tài liệu
        </button>
      </div>
    </div>
  );
}
