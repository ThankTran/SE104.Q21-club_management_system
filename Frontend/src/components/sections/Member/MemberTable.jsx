import styles from './MemberTable.module.css';

const ROLE_STYLE = {
  'Chủ nhiệm': { bg: '#dff0f7', color: '#1a6b8a' },
  'Phó chủ nhiệm': { bg: '#e8f4e8', color: '#276749' },
  'Trưởng ban học thuật': { bg: '#ede8f8', color: '#5b3fa8' },
  'Trưởng ban truyền thông': { bg: '#fef3c7', color: '#92400e' },
  'Thành viên': { bg: '#e8ecf2', color: '#3a4a5c' },
};

const STATUS_STYLE = {
  'Đã duyệt': { dot: '#38a169', text: '#276749', label: 'Đã duyệt' },
  'Đang xét duyệt': { dot: '#f59e0b', text: '#b45309', label: 'Đang xét duyệt' },
  'Từ chối': { dot: '#e53e3e', text: '#c53030', label: 'Từ chối' },
  Active: { dot: '#38a169', text: '#276749', label: 'Đã duyệt' },
};

const AVATAR_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#10b981',
  '#f59e0b', '#06b6d4', '#ef4444', '#84cc16',
];

function Avatar({ initials, name }) {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
  return (
    <div className={styles.avatar} style={{ background: AVATAR_COLORS[idx] }}>
      {initials || name?.slice(0, 2).toUpperCase()}
    </div>
  );
}

function RoleBadge({ role }) {
  const s = ROLE_STYLE[role] || { bg: '#f3f4f6', color: '#374151' };
  return <span className={styles.badge} style={{ background: s.bg, color: s.color }}>{role}</span>;
}

function StatusCell({ status }) {
  const s = STATUS_STYLE[status] || { dot: '#a0aec0', text: '#718096', label: status };
  return (
    <span className={styles.statusWrap} style={{ color: s.text }}>
      <span className={styles.statusDot} style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

function formatDate(value) {
  if (!value) return 'Chưa cập nhật';
  const [year, month, day] = value.slice(0, 10).split('-');
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
}

function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageList = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5);

  return (
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>
        Hiển thị {start}-{end} trong tổng số {total.toLocaleString()} thành viên
      </span>
      <div className={styles.paginationControls}>
        <button className={styles.pageBtn} onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>
        {pageList.map((p) => (
          <button key={p} className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`} onClick={() => onPageChange(p)}>
            {p}
          </button>
        ))}
        <button className={styles.pageBtn} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>›</button>
      </div>
    </div>
  );
}

export default function MemberTable({
  members = [],
  total = 0,
  page = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  onApprove,
  onReject,
  isAdmin = false,
  showActions = true,
  showViewAction = true,
  showReviewActions = true,
  showRequestStatus = true,
  showContact = true,
  showRegisteredAt = false,
  loading = false,
}) {
  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Đang tải danh sách thành viên...</p>
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className={styles.empty}>
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#cbd5e0" strokeWidth="1.2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
        <p>Không tìm thấy thành viên nào</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Thành viên</th>
              <th>Khoa / Khóa</th>
              {showContact && <th>Liên hệ</th>}
              {showRegisteredAt && <th>Ngày đăng ký</th>}
              <th>Vai trò</th>
              {showRequestStatus && <th>Hồ sơ</th>}
              {isAdmin && showActions && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className={`${styles.row} ${onView ? styles.clickableRow : ''}`}
                onClick={() => onView?.(m)}
              >
                <td>
                  <div className={styles.memberCell}>
                    <Avatar initials={m.avatar} name={m.name} />
                    <div>
                      <p className={styles.memberName}>{m.name}</p>
                      <p className={styles.memberId}>MSSV: {m.id}</p>
                    </div>
                  </div>
                </td>
                <td className={styles.dept}>
                  <span>{m.department}</span>
                  <small>{m.course}</small>
                </td>
                {showContact && (
                  <td className={styles.contactCell}>
                    <span>{m.email}</span>
                    <small>{m.phone || 'Chưa có SĐT'}</small>
                  </td>
                )}
                {showRegisteredAt && (
                  <td className={styles.dateCell}>
                    {formatDate(m.registeredAt)}
                  </td>
                )}
                <td><RoleBadge role={m.role} /></td>
                {showRequestStatus && <td><StatusCell status={m.requestStatus || m.status} /></td>}
                {isAdmin && showActions && (
                  <td>
                    <div className={styles.actionBtns} onClick={(e) => e.stopPropagation()}>
                      {showViewAction && (
                        <button className={styles.viewBtn} onClick={() => onView?.(m)} title="Chi tiết" aria-label="Chi tiết">Chi tiết</button>
                      )}
                      {showReviewActions && m.requestStatus === 'Đang xét duyệt' && (
                        <>
                          <button className={styles.approveBtn} onClick={() => onApprove?.(m)} title="Duyệt" aria-label="Duyệt">✓</button>
                          <button className={styles.rejectBtn} onClick={() => onReject?.(m)} title="Từ chối" aria-label="Từ chối">✕</button>
                        </>
                      )}
                      <button className={styles.editBtn} onClick={() => onEdit?.(m)} title="Chỉnh sửa" aria-label="Chỉnh sửa"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                      <button className={styles.deleteBtn} onClick={() => onDelete?.(m)} title="Xóa" aria-label="Xóa"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}


