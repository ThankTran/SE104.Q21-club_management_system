import { useState, useMemo } from 'react';
import MemberTable from '../../components/sections/Member/MemberTable';
import styles from './MemberUserPage.module.css';

// ── Mock data (same shape, read-only) ───────────────────────
// ── Mock data ────────────────────────────────────────────────
const MOCK_MEMBERS = [
  { id: '2410001', name: 'Nguyễn Minh Anh',      department: 'Khoa Khoa học máy tính',               role: 'Chủ nhiệm',                status: 'Active',   avatar: 'NA' },
  { id: '2410002', name: 'Trần Quốc Bảo',        department: 'Khoa Công nghệ phần mềm',             role: 'Phó chủ nhiệm',           status: 'Active',   avatar: 'TB' },
  { id: '2410003', name: 'Lê Hoàng Nam',         department: 'Khoa Kỹ thuật máy tính',             role: 'Trưởng ban học thuật',    status: 'Active',   avatar: 'LN' },
  { id: '2410004', name: 'Phạm Gia Hân',         department: 'Khoa Hệ thống thông tin',            role: 'Trưởng ban truyền thông', status: 'Active',   avatar: 'PH' },
  { id: '2410005', name: 'Võ Đức Tài',           department: 'Khoa Mạng máy tính & Truyền thông',  role: 'Thành viên',              status: 'Active',   avatar: 'VT' },
  { id: '2410006', name: 'Nguyễn Khánh Linh',    department: 'Khoa Khoa học & Kỹ thuật thông tin', role: 'Thành viên',              status: 'On Leave', avatar: 'NL' },
  { id: '2410007', name: 'Đặng Nhật Quang',      department: 'Khoa Công nghệ phần mềm',             role: 'Thành viên',              status: 'Active',   avatar: 'DQ' },
  { id: '2410008', name: 'Huỳnh Bảo Trân',       department: 'Khoa Khoa học máy tính',             role: 'Thành viên',              status: 'Inactive', avatar: 'HT' },
  { id: '2410009', name: 'Trương Hải Đăng',      department: 'Khoa Kỹ thuật máy tính',             role: 'Thành viên',              status: 'Active',   avatar: 'TD' },
  { id: '2410010', name: 'Bùi Ngọc Mai',         department: 'Khoa Hệ thống thông tin',            role: 'Thành viên',              status: 'Active',   avatar: 'BM' },

  { id: '2410011', name: 'Lý Tuấn Kiệt',         department: 'Khoa Công nghệ phần mềm',             role: 'Thành viên',              status: 'Active',   avatar: 'LK' },
  { id: '2410012', name: 'Phan Thảo Vy',         department: 'Khoa Khoa học máy tính',             role: 'Thành viên',              status: 'Active',   avatar: 'PV' },
  { id: '2410013', name: 'Ngô Gia Huy',          department: 'Khoa Mạng máy tính & Truyền thông',  role: 'Thành viên',              status: 'On Leave', avatar: 'NH' },
  { id: '2410014', name: 'Mai Thanh Tùng',       department: 'Khoa Kỹ thuật máy tính',             role: 'Thành viên',              status: 'Active',   avatar: 'MT' },
  { id: '2410015', name: 'Đoàn Yến Nhi',         department: 'Khoa Hệ thống thông tin',            role: 'Thành viên',              status: 'Active',   avatar: 'DN' },
  { id: '2410016', name: 'Tạ Minh Khoa',         department: 'Khoa Khoa học & Kỹ thuật thông tin', role: 'Thành viên',              status: 'Inactive', avatar: 'TK' },
  { id: '2410017', name: 'Vũ Thành Công',        department: 'Khoa Công nghệ phần mềm',             role: 'Thành viên',              status: 'Active',   avatar: 'VC' },
  { id: '2410018', name: 'Châu Bích Ngọc',       department: 'Khoa Khoa học máy tính',             role: 'Thành viên',              status: 'Active',   avatar: 'CN' },
  { id: '2410019', name: 'Nguyễn Quốc Hưng',     department: 'Khoa Kỹ thuật máy tính',             role: 'Thành viên',              status: 'Active',   avatar: 'NH' },
  { id: '2410020', name: 'Lâm Gia Linh',         department: 'Khoa Hệ thống thông tin',            role: 'Thành viên',              status: 'On Leave', avatar: 'LL' },
];

const DEPT_OPTIONS = [
  'All',
  'Khoa Khoa học máy tính',
  'Khoa Công nghệ phần mềm',
  'Khoa Kỹ thuật máy tính',
  'Khoa Khoa học & Kỹ thuật thông tin',
  'Khoa Hệ thống thông tin',
  'Khoa Mạng máy tính & Truyền thông'
];
const PAGE_SIZE = 10;

export default function MemberUserPage() {
  const [search, setSearch]   = useState('');
  const [dept, setDept]       = useState('All');
  const [page, setPage]       = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_MEMBERS.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.id.includes(q) ||
        m.department.toLowerCase().includes(q);
      const matchDept = dept === 'All' || m.department === dept;
      return matchSearch && matchDept;
    });
  }, [search, dept]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Danh sách thành viên</h1>
          <p className={styles.pageSubtitle}>
            Xem danh sách các thành viên trong câu lạc bộ.
          </p>
        </div>

        {/* Total badge */}
        <div className={styles.totalBadge}>
          <span className={styles.totalNum}>{MOCK_MEMBERS.length.toLocaleString()}</span>
          <span className={styles.totalLabel}>thành viên</span>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className={styles.filterBar}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Tìm theo tên hoặc ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Department filter */}
        <div className={styles.deptTabs}>
          {DEPT_OPTIONS.map((d) => (
            <button
              key={d}
              className={`${styles.deptTab} ${dept === d ? styles.deptTabActive : ''}`}
              onClick={() => { setDept(d); setPage(1); }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table (read-only, no actions) ── */}
      <MemberTable
        members={paginated}
        total={filtered.length}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={(p) => { if (p >= 1 && p <= totalPages) setPage(p); }}
        isAdmin={false}
      />
    </div>
  );
}