import { useState, useMemo, useEffect } from 'react';

import MemberTable from '../components/sections/Member/MemberTable';
import MemberForm from '../components/sections/Member/MemberForm';
import styles from './MemberAdminPage.module.css';

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

const STATS = [
  {
    label: 'TOTAL MEMBERS',
    value: '1,284',
    sub: '↑ 12% from last term',
    subColor: '#38a169',
    variant: 'default',
    accent: '#e0f0ff',
  },
  {
    label: 'STEM FACULTY',
    value: '412',
    sub: null,
    variant: 'teal',
    barColor: '#0bc5ea',
    barPct: 32,
  },
  {
    label: 'PURE SCIENCES',
    value: '328',
    sub: null,
    variant: 'purple',
    barColor: '#805ad5',
    barPct: 25,
  },
  {
    label: 'ACTIVE NOW',
    value: '89',
    sub: 'Real-time portal access',
    variant: 'dark',
  },
];

const PAGE_SIZE = 10;

// ── Stat card ────────────────────────────────────────────────
function StatCard({ stat }) {
  const { label, value, sub, subColor, variant, barColor, barPct } = stat;

  return (
    <div className={`${styles.statCard} ${styles[`statCard_${variant}`]}`}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      {sub && (
        <p className={styles.statSub} style={subColor ? { color: subColor } : {}}>
          {sub}
        </p>
      )}
      {barColor && (
        <div className={styles.statBar}>
          <div className={styles.statBarFill} style={{ width: `${barPct}%`, background: barColor }} />
        </div>
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function MemberAdminPage() {
  const [members, setMembers]     = useState(MOCK_MEMBERS);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [formOpen, setFormOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Filter + paginate ──────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.includes(q) ||
        m.department.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q),
    );
  }, [members, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Handlers ──────────────────────────────────────────────
  const openAdd = () => { setEditTarget(null); setFormOpen(true); };

  const openEdit = (member) => { setEditTarget(member); setFormOpen(true); };

  const handleSubmit = (formData) => {
    setFormLoading(true);
    setTimeout(() => {
      if (editTarget) {
        setMembers((prev) =>
          prev.map((m) => (m.id === editTarget.id ? { ...m, ...formData } : m)),
        );
      } else {
        const newId = String(Math.floor(Math.random() * 90000) + 10000);
        setMembers((prev) => [
          { ...formData, id: newId, avatar: formData.name.slice(0, 2).toUpperCase() },
          ...prev,
        ]);
      }
      setFormLoading(false);
      setFormOpen(false);
      setPage(1);
    }, 800);
  };

  const handleDelete = (member) => setDeleteConfirm(member);

  const confirmDelete = () => {
    setMembers((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Member Directory</h1>
          <p className={styles.pageSubtitle}>
            Manage and monitor academic staff and student researchers.
          </p>
        </div>

        {/* Search + Filter + Add */}
        <div className={styles.headerActions}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <button className={styles.filterBtn}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
            Filters
          </button>

          <button className={styles.addBtn} onClick={openAdd}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Member
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className={styles.statsRow}>
        {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* ── Table ── */}
      <MemberTable
        members={paginated}
        total={filtered.length}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
        onEdit={openEdit}
        onDelete={handleDelete}
        isAdmin
      />

      {/* ── Floating Add button ── */}
      <button className={styles.fab} onClick={openAdd} title="Add Member">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      {/* ── Add / Edit form modal ── */}
      <MemberForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
        loading={formLoading}
      />

      {/* ── Delete confirm modal ── */}
      {deleteConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#e53e3e" strokeWidth="1.8">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 className={styles.confirmTitle}>Xoá thành viên?</h3>
            <p className={styles.confirmMsg}>
              Bạn có chắc muốn xoá <strong>{deleteConfirm.name}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancel} onClick={() => setDeleteConfirm(null)}>Huỷ</button>
              <button className={styles.confirmDelete} onClick={confirmDelete}>Xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}