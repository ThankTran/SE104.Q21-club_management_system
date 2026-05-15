import styles from './ResourceAdminTabs.module.css';

export default function ResourceAdminTabs({ activeTab, approvedCount, onChange }) {
  return (
    <div className={styles.tabs}>
      <button
        type="button"
        className={`${styles.tabBtn} ${activeTab === 'review' ? styles.active : ''}`}
        onClick={() => onChange('review')}
      >
          Chờ duyệt tài liệu
      </button>
      <button
        type="button"
        className={`${styles.tabBtn} ${activeTab === 'lookup' ? styles.active : ''}`}
        onClick={() => onChange('lookup')}
      >
        Tra cứu kho tài liệu
        <span className={styles.badge}>{approvedCount}</span>
      </button>
    </div>
  );
}
