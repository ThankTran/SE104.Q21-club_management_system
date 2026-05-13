import styles from './ResourceCard.module.css';

const FORMAT_ICON = {
  PDF:  { icon: '📄', bg: '#fee2e2', color: '#b91c1c' },
  DOCX: { icon: '📝', bg: '#dbeafe', color: '#1d4ed8' },
  PPT:  { icon: '📊', bg: '#fef3c7', color: '#b45309' },
  Khác: { icon: '📎', bg: '#f3e8ff', color: '#7c3aed' },
};

const TYPE_STYLE = {
  'Giáo trình':          { bg: '#e0f2fe', color: '#0369a1' },
  'Slide bài giảng':     { bg: '#dcfce7', color: '#15803d' },
  'Tài liệu tham khảo': { bg: '#fef9c3', color: '#a16207' },
  'Khác':                { bg: '#f3e8ff', color: '#7c3aed' },
};

/**
 * Props:
 *   resource  – { id, title, subject, type, format, source, description, link, uploadedBy, createdAt, status }
 *   onClick   – () => void  (mở detail modal)
 *   compact   – boolean     (dùng trong bảng user, ít thông tin hơn)
 */
export default function ResourceCard({ resource, onClick, compact = false }) {
  const { title, subject, type, format, uploadedBy, createdAt } = resource;

  const fmt   = FORMAT_ICON[format] || FORMAT_ICON['Khác'];
  const ts    = TYPE_STYLE[type]    || { bg: '#f3f4f6', color: '#374151' };

  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className={`${styles.card} ${compact ? styles.cardCompact : ''}`} onClick={onClick}>
      {/* Format badge */}
      <div className={styles.fmtBadge} style={{ background: fmt.bg }}>
        <span className={styles.fmtIcon}>{fmt.icon}</span>
        <span className={styles.fmtLabel} style={{ color: fmt.color }}>{format}</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <p className={styles.subject}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          {subject}
        </p>

        <div className={styles.meta}>
          <span className={styles.typeBadge} style={{ background: ts.bg, color: ts.color }}>
            {type}
          </span>

          {!compact && (
            <span className={styles.uploader}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {uploadedBy}
            </span>
          )}

          <span className={styles.date}>{dateStr}</span>
        </div>
      </div>

      {/* Arrow */}
      <span className={styles.arrow}>→</span>
    </div>
  );
}