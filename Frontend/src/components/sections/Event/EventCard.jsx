import styles from './EventCard.module.css';

/**
 * Props:
 *   event      – { id, title, location, date, estimatedCost, status, tag }
 *   onClick    – () => void
 *   onRegister – () => void  (user mode)
 *   isAdmin    – boolean
 */
export default function EventCard({ event, onClick, onRegister, isAdmin = false }) {
  const { title, location, date, estimatedCost, status, tag } = event;

  // Parse date thành { month, day }
  const d     = date ? new Date(date) : null;
  const month = d ? d.toLocaleString('vi-VN', { month: 'short' }).toUpperCase() : '--';
  const day   = d ? d.getDate() : '--';

  const STATUS_STYLE = {
    published:  { bg: '#e6f4ea', color: '#276749', label: 'Đã công bố'  },
    draft:      { bg: '#e8ecf2', color: '#3a4a5c', label: 'Nháp'        },
    completed:  { bg: '#ede8f8', color: '#5b3fa8', label: 'Đã kết thúc' },
    upcoming:   { bg: '#e0f0ff', color: '#1a6b8a', label: 'Sắp diễn ra' },
    cancelled:  { bg: '#fff0f0', color: '#e53e3e', label: 'Đã huỷ'      },
  };

  const ss = STATUS_STYLE[status?.toLowerCase()] || STATUS_STYLE.upcoming;

  return (
    <div className={styles.card} onClick={onClick}>
      {/* Date badge */}
      <div className={styles.dateBadge}>
        <span className={styles.dateMonth}>{month}</span>
        <span className={styles.dateDay}>{day}</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.top}>
          <h3 className={styles.title}>{title}</h3>
          {tag && <span className={styles.tag}>{tag}</span>}
        </div>

        {location && (
          <p className={styles.location}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {location}
          </p>
        )}

        <div className={styles.bottom}>
          {estimatedCost != null && (
            <span className={styles.cost}>
              Est. {Number(estimatedCost).toLocaleString('vi-VN')}₫
            </span>
          )}

          {status && (
            <span className={styles.status} style={{ background: ss.bg, color: ss.color }}>
              {ss.label}
            </span>
          )}

          {/* Arrow hoặc Register button */}
          {isAdmin ? (
            <span className={styles.arrow}>→</span>
          ) : (
            <button
              className={styles.registerBtn}
              onClick={(e) => { e.stopPropagation(); onRegister?.(); }}
            >
              Đăng ký →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}