import { DEPARTMENTS } from './MemberForm';
import styles from './MemberUserFilterBar.module.css';

const DEPT_OPTIONS = ['Tất cả', ...DEPARTMENTS];

export default function MemberUserFilterBar({
  search,
  onSearchChange,
  dept,
  onDeptChange,
}) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchWrap}>
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          className={styles.searchInput}
          placeholder="Tìm theo tên, MSSV hoặc email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={styles.deptTabs}>
        {DEPT_OPTIONS.map((item) => (
          <button
            key={item}
            className={`${styles.deptTab} ${dept === item ? styles.deptTabActive : ''}`}
            onClick={() => onDeptChange(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
