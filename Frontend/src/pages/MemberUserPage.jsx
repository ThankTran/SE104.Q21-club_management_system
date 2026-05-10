import { useState, useMemo } from 'react';
import MemberTable from '../components/sections/Member/MemberTable';
import styles from './MemberUserPage.module.css';

// ── Mock data (same shape, read-only) ───────────────────────
const MOCK_MEMBERS = [
  { id: '44021', name: 'Dr. Elena Rodriguez', department: 'Astrophysics',      role: 'Head of Research', status: 'Active',   avatar: 'ER' },
  { id: '44038', name: 'Marcus Thorne',        department: 'Data Science',      role: 'Senior Fellow',    status: 'On Leave', avatar: 'MT' },
  { id: '44102', name: 'Sarah Jenkins',        department: 'Molecular Biology', role: 'Researcher',       status: 'Active',   avatar: 'SJ' },
  { id: '44095', name: 'Julian Vance',         department: 'Quantum Physics',   role: 'Senior Fellow',    status: 'Active',   avatar: 'JV' },
  { id: '44110', name: 'Anh Nguyen',           department: 'Computer Science',  role: 'Researcher',       status: 'Active',   avatar: 'AN' },
  { id: '44055', name: 'Priya Patel',          department: 'Biochemistry',      role: 'Senior Fellow',    status: 'Inactive', avatar: 'PP' },
  { id: '44073', name: 'Leo Kim',              department: 'Mathematics',       role: 'Researcher',       status: 'Active',   avatar: 'LK' },
  { id: '44088', name: 'Fatima Al-Hassan',     department: 'Astrophysics',      role: 'Head of Research', status: 'Active',   avatar: 'FA' },
];

const DEPT_OPTIONS = ['All', 'Astrophysics', 'Data Science', 'Molecular Biology', 'Quantum Physics', 'Computer Science', 'Biochemistry', 'Mathematics'];

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
          <h1 className={styles.pageTitle}>Member Directory</h1>
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