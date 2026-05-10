import styles from './MemberTable.module.css';

// ── Constants ────────────────────────────────────────────────
const ROLE_STYLE = {
  'Chủ nhiệm':                { bg: '#dff0f7', color: '#1a6b8a' },
  'Phó chủ nhiệm':            { bg: '#e8f4e8', color: '#276749' },
  'Trưởng ban học thuật':     { bg: '#ede8f8', color: '#5b3fa8' },
  'Trưởng ban truyền thông':  { bg: '#fef3c7', color: '#92400e' },
  'Thành viên':               { bg: '#e8ecf2', color: '#3a4a5c' },
};

const STATUS_STYLE = {
  'Active':   { dot: '#38a169', text: '#38a169', label: 'Hoạt động'  },
  'On Leave': { dot: '#a0aec0', text: '#718096', label: 'Tạm nghỉ'   },
  'Inactive': { dot: '#e53e3e', text: '#e53e3e', label: 'Không hoạt động' },
};

const AVATAR_COLORS = [
  '#3b82f6','#8b5cf6','#ec4899',
  '#10b981','#f59e0b','#06b6d4','#ef4444','#84cc16',
];

// ── Sub-components ───────────────────────────────────────────
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
  return (
    <span className={styles.badge} style={{ background: s.bg, color: s.color }}>
      {role}
    </span>
  );
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

// ── Pagination ───────────────────────────────────────────────
function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages]);
    return [...pages]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
  };

  const pageList = getPages();

  return (
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>
        Hiển thị {start}–{end} trong tổng số {total.toLocaleString()} thành viên
      </span>
      <div className={styles.paginationControls}>
        <button
          className={styles.pageBtn}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >‹</button>

        {pageList.map((p, i) => {
          const prev = pageList[i - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <span key={p} className={styles.pageGroup}>
              {showEllipsis && <span className={styles.ellipsis}>…</span>}
              <button
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          className={styles.pageBtn}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >›</button>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function MemberTable({
  members = [],
  total = 0,
  page = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  onEdit,
  onDelete,
  isAdmin = false,
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
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
        <p>Không tìm thấy thành viên nào</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>THÀNH VIÊN</th>
            <th>KHOA</th>
            <th>VAI TRÒ</th>
            <th>TRẠNG THÁI</th>
            {isAdmin && <th>THAO TÁC</th>}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className={styles.row}>
              <td>
                <div className={styles.memberCell}>
                  <Avatar initials={m.avatar} name={m.name} />
                  <div>
                    <p className={styles.memberName}>{m.name}</p>
                    <p className={styles.memberId}>MSSV: {m.id}</p>
                  </div>
                </div>
              </td>
              <td className={styles.dept}>{m.department}</td>
              <td><RoleBadge role={m.role} /></td>
              <td><StatusCell status={m.status} /></td>
              {isAdmin && (
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => onEdit?.(m)}>
                      Sửa
                    </button>
                    <button className={styles.deleteBtn} onClick={() => onDelete?.(m)}>
                      Xoá
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

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