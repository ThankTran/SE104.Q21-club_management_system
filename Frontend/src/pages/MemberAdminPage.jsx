import { useState, useMemo } from 'react';

import MemberTable from '../components/sections/Member/MemberTable';
import MemberForm from '../components/sections/Member/MemberForm';
import MemberFilter from '../components/sections/Member/MemberFilter';
import styles from './MemberAdminPage.module.css';

// ── Mock data ────────────────────────────────────────────────
const MOCK_MEMBERS = [
  { id: '2410001', name: 'Nguyễn Minh Anh',      department: 'Khoa Khoa học máy tính',               role: 'Chủ nhiệm',                status: 'Active',   avatar: 'NA' },
  { id: '2410002', name: 'Trần Quốc Bảo',        department: 'Khoa Công nghệ phần mềm',             role: 'Phó chủ nhiệm',            status: 'Active',   avatar: 'TB' },
  { id: '2410003', name: 'Lê Hoàng Nam',         department: 'Khoa Kỹ thuật máy tính',              role: 'Trưởng ban học thuật',     status: 'Active',   avatar: 'LN' },
  { id: '2410004', name: 'Phạm Gia Hân',         department: 'Khoa Hệ thống thông tin',             role: 'Trưởng ban truyền thông',  status: 'Active',   avatar: 'PH' },
  { id: '2410005', name: 'Võ Đức Tài',           department: 'Khoa Mạng máy tính & Truyền thông',   role: 'Thành viên',               status: 'Active',   avatar: 'VT' },
  { id: '2410006', name: 'Nguyễn Khánh Linh',    department: 'Khoa Khoa học & Kỹ thuật thông tin',  role: 'Thành viên',               status: 'On Leave', avatar: 'NL' },
  { id: '2410007', name: 'Đặng Nhật Quang',      department: 'Khoa Công nghệ phần mềm',             role: 'Thành viên',               status: 'Active',   avatar: 'DQ' },
  { id: '2410008', name: 'Huỳnh Bảo Trân',       department: 'Khoa Khoa học máy tính',              role: 'Thành viên',               status: 'Inactive', avatar: 'HT' },
  { id: '2410009', name: 'Trương Hải Đăng',      department: 'Khoa Kỹ thuật máy tính',              role: 'Thành viên',               status: 'Active',   avatar: 'TD' },
  { id: '2410010', name: 'Bùi Ngọc Mai',         department: 'Khoa Hệ thống thông tin',             role: 'Thành viên',               status: 'Active',   avatar: 'BM' },
  { id: '2410011', name: 'Lý Tuấn Kiệt',         department: 'Khoa Công nghệ phần mềm',             role: 'Thành viên',               status: 'Active',   avatar: 'LK' },
  { id: '2410012', name: 'Phan Thảo Vy',         department: 'Khoa Khoa học máy tính',              role: 'Thành viên',               status: 'Active',   avatar: 'PV' },
  { id: '2410013', name: 'Ngô Gia Huy',          department: 'Khoa Mạng máy tính & Truyền thông',   role: 'Thành viên',               status: 'On Leave', avatar: 'NH' },
  { id: '2410014', name: 'Mai Thanh Tùng',       department: 'Khoa Kỹ thuật máy tính',              role: 'Thành viên',               status: 'Active',   avatar: 'MT' },
  { id: '2410015', name: 'Đoàn Yến Nhi',         department: 'Khoa Hệ thống thông tin',             role: 'Thành viên',               status: 'Active',   avatar: 'DN' },
  { id: '2410016', name: 'Tạ Minh Khoa',         department: 'Khoa Khoa học & Kỹ thuật thông tin',  role: 'Thành viên',               status: 'Inactive', avatar: 'TK' },
  { id: '2410017', name: 'Vũ Thành Công',        department: 'Khoa Công nghệ phần mềm',             role: 'Thành viên',               status: 'Active',   avatar: 'VC' },
  { id: '2410018', name: 'Châu Bích Ngọc',       department: 'Khoa Khoa học máy tính',              role: 'Thành viên',               status: 'Active',   avatar: 'CN' },
  { id: '2410019', name: 'Nguyễn Quốc Hưng',     department: 'Khoa Kỹ thuật máy tính',              role: 'Thành viên',               status: 'Active',   avatar: 'NH' },
  { id: '2410020', name: 'Lâm Gia Linh',         department: 'Khoa Hệ thống thông tin',             role: 'Thành viên',               status: 'On Leave', avatar: 'LL' },
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
        <p
          className={styles.statSub}
          style={subColor ? { color: subColor } : {}}
        >
          {sub}
        </p>
      )}

      {barColor && (
        <div className={styles.statBar}>
          <div
            className={styles.statBarFill}
            style={{
              width: `${barPct}%`,
              background: barColor,
            }}
          />
        </div>
      )}
    </div>
  );
}


// ── Main ─────────────────────────────────────────────────────
export default function MemberAdminPage() {
  const [members, setMembers]         = useState(MOCK_MEMBERS);
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);
  const [formOpen, setFormOpen]       = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);

  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
// ── THỐNG KÊ ĐỘNG ──────────────────────────────────────────
  const STATS = useMemo(() => {
    const total = members.length;

    const countByDepartment = (name) =>
      members.filter((m) => m.department === name).length;

    const activeCount = members.filter(
      (m) => m.status === 'Active'
    ).length;

    const createDeptStat = (
      label,
      department,
      variant,
      color
    ) => {
      const count = countByDepartment(department);

      return {
        label,
        value: count.toString(),
        sub: null,
        variant,
        barColor: color,
        barPct: total ? Math.round((count / total) * 100) : 0,
      };
    };

    return [
      {
        label: 'TỔNG THÀNH VIÊN',
        value: total.toString(),
        sub: null,
        variant: 'default',
      },

      createDeptStat(
        'KHOA KỸ THUẬT MÁY TÍNH',
        'Khoa Kỹ thuật máy tính',
        'teal',
        '#0bc5ea'
      ),

      createDeptStat(
        'KHOA KHOA HỌC MÁY TÍNH',
        'Khoa Khoa học máy tính',
        'purple',
        '#805ad5'
      ),

      createDeptStat(
        'KHOA CÔNG NGHỆ PHẦN MỀM',
        'Khoa Công nghệ phần mềm',
        'blue',
        '#3182ce'
      ),

      createDeptStat(
        'KHOA HỆ THỐNG THÔNG TIN',
        'Khoa Hệ thống thông tin',
        'orange',
        '#dd6b20'
      ),

      createDeptStat(
        'KHOA MẠNG MÁY TÍNH & TRUYỀN THÔNG',
        'Khoa Mạng máy tính & Truyền thông',
        'pink',
        '#d53f8c'
      ),

      createDeptStat(
        'KHOA KHOA HỌC & KỸ THUẬT THÔNG TIN',
        'Khoa Khoa học & Kỹ thuật thông tin',
        'green',
        '#38a169'
      ),

      {
        label: 'ĐANG HOẠT ĐỘNG',
        value: activeCount.toString(),
        sub: `${Math.round((activeCount / total) * 100)}% thành viên`,
        variant: 'dark',
      },
    ];
  }, [members]);

  const departments = useMemo(
  () => [...new Set(members.map((m) => m.department))],
  [members]
  );

  const statuses = useMemo(
    () => [...new Set(members.map((m) => m.status))],
    [members]
  );

  const roles = useMemo(
    () => [...new Set(members.map((m) => m.role))],
    [members]
  );

  // ── Filter + paginate ──────────────────────────────────────
  const filtered = useMemo(() => {
  const q = search.toLowerCase();

  return members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      m.id.includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q);

    const matchDepartment =
      !departmentFilter ||
      m.department === departmentFilter;

    const matchStatus =
      !statusFilter ||
      m.status === statusFilter;

    const matchRole =
      !roleFilter ||
      m.role === roleFilter;

    return (
      matchSearch &&
      matchDepartment &&
      matchStatus &&
      matchRole
    );
  });
  }, [
    members,
    search,
    departmentFilter,
    statusFilter,
    roleFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Handlers ──────────────────────────────────────────────
  const openAdd  = () => { setEditTarget(null); setFormOpen(true); };
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

  const handleDelete  = (member) => setDeleteConfirm(member);
  const confirmDelete = () => {
    setMembers((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };
  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div className={styles.page}>

      {/* ── Tiêu đề trang ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Danh sách thành viên</h1>
          <p className={styles.pageSubtitle}>
            Quản lý và theo dõi thành viên ban chủ nhiệm và thành viên câu lạc bộ.
          </p>
        </div>

        {/* Tìm kiếm + Lọc + Thêm */}
        <div className={styles.headerActions}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Tìm theo tên hoặc mã số..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <MemberFilter
            open={filterOpen}
            setOpen={setFilterOpen}

            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}

            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}

            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}

            departments={departments}
            statuses={statuses}
            roles={roles}
          />

          <button className={styles.addBtn} onClick={openAdd}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Thêm thành viên
          </button>
        </div>
      </div>

      {/* ── Thống kê ── */}
      <div className={styles.statsRow}>
        {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* ── Bảng danh sách ── */}
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

      {/* ── Nút thêm nhanh góc phải ── */}
      <button className={styles.fab} onClick={openAdd} title="Thêm thành viên">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      {/* ── Modal thêm / chỉnh sửa ── */}
      <MemberForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
        loading={formLoading}
      />

      {/* ── Modal xác nhận xoá ── */}
      {deleteConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#e53e3e" strokeWidth="1.8">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 className={styles.confirmTitle}>Xoá thành viên?</h3>
            <p className={styles.confirmMsg}>
              Bạn có chắc muốn xoá <strong>{deleteConfirm.name}</strong>?
              Hành động này không thể hoàn tác.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancel} onClick={() => setDeleteConfirm(null)}>
                Huỷ
              </button>
              <button className={styles.confirmDelete} onClick={confirmDelete}>
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}