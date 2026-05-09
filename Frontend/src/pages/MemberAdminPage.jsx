import { useState, useMemo, useEffect } from 'react';

import MemberTable from '../components/sections/Member/MemberTable';
import MemberForm from '../components/sections/Member/MemberForm';
import styles from './MemberAdminPage.module.css';

// ── Mock data ────────────────────────────────────────────────
const MOCK_MEMBERS = [
  { id: '44021', name: 'Dr. Elena Rodriguez', department: 'Astrophysics',     role: 'Head of Research', status: 'Active',   avatar: 'ER' },
  { id: '44038', name: 'Marcus Thorne',        department: 'Data Science',     role: 'Senior Fellow',    status: 'On Leave', avatar: 'MT' },
  { id: '44102', name: 'Sarah Jenkins',        department: 'Molecular Biology',role: 'Researcher',       status: 'Active',   avatar: 'SJ' },
  { id: '44095', name: 'Julian Vance',         department: 'Quantum Physics',  role: 'Senior Fellow',    status: 'Active',   avatar: 'JV' },
  { id: '44110', name: 'Anh Nguyen',           department: 'Computer Science', role: 'Researcher',       status: 'Active',   avatar: 'AN' },
  { id: '44055', name: 'Priya Patel',          department: 'Biochemistry',     role: 'Senior Fellow',    status: 'Inactive', avatar: 'PP' },
  { id: '44073', name: 'Leo Kim',              department: 'Mathematics',      role: 'Researcher',       status: 'Active',   avatar: 'LK' },
  { id: '44088', name: 'Fatima Al-Hassan',     department: 'Astrophysics',     role: 'Head of Research', status: 'Active',   avatar: 'FA' },
  { id: '44031', name: 'James O\'Brien',       department: 'Data Science',     role: 'Admin',            status: 'Active',   avatar: 'JO' },
  { id: '44067', name: 'Yuki Tanaka',          department: 'Molecular Biology',role: 'Researcher',       status: 'On Leave', avatar: 'YT' },
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