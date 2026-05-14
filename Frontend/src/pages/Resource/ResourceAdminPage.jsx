import { useMemo, useState } from "react";
import ResourceForm from "../../components/sections/Resource/ResourceForm";
import ResourceDetailModal from "../../components/sections/Resource/ResourceDetailModal";
import ResourceTable from "../../components/sections/Resource/ResourceTable";
import ResourceFilter from "../../components/sections/Resource/ResourceFilter";
import styles from "./ResourceAdminPage.module.css";

const INITIAL_RESOURCES = [
  { id: 1, formCode: "BM7-001", title: "Giáo trình OOP", category: "major", major: "Công nghệ phần mềm", subject: "Lập trình hướng đối tượng", type: "Giáo trình", format: "PDF", source: "Giảng viên cung cấp", description: "Tài liệu OOP học kỳ 1.", link: "https://drive.google.com/1", uploadedBy: "Nguyễn Minh Anh", memberId: "TV001", role: "Thành viên", createdAt: "2024-12-10", reviewedBy: "Admin", reviewedAt: "2024-12-11", note: "Đạt yêu cầu", status: "approved" },
  { id: 2, formCode: "BM7-002", title: "Slide CSDL chương 1-5", category: "major", major: "Hệ thống thông tin", subject: "Cơ sở dữ liệu", type: "Slide bài giảng", format: "PPT", source: "Giảng viên cung cấp", description: "Slide ERD và SQL cơ bản.", link: "https://drive.google.com/2", uploadedBy: "Trần Quốc Bảo", memberId: "TV002", role: "Ban học tập", createdAt: "2024-12-08", reviewedBy: "", reviewedAt: "", note: "", status: "pending" },
];

export default function ResourceAdminPage() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // States cho Filter
  const [typeFilter, setTypeFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  // Thống kê nhanh
  const stats = useMemo(() => ({
    total: resources.length,
    pending: resources.filter(r => r.status === 'pending').length,
    approved: resources.filter(r => r.status === 'approved').length
  }), [resources]);

  // Logic lọc tài liệu
  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.formCode.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || r.type === typeFilter;
    const matchFormat = formatFilter === "all" || r.format === formatFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchType && matchFormat && matchStatus;
  });

  const handleApprove = (id) => {
    setResources(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'approved', reviewedAt: new Date().toISOString().split('T')[0], reviewedBy: 'Admin' } : r
    ));
    setSelected(null);
  };

  const handleReject = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setSelected(null);
  };

  const handleSubmit = (data) => {
    // QĐ7.3: Kiểm tra trùng lặp (Tên + Link)
    const isDuplicate = resources.some(r => r.title === data.title && r.link === data.link && r.id !== editing?.id);
    if (isDuplicate) {
      alert("Lỗi QĐ7.3: Tên tài liệu và đường dẫn này đã tồn tại trong hệ thống!");
      return;
    }

    if (editing) {
      setResources(prev => prev.map(r => r.id === editing.id ? { ...r, ...data } : r));
    } else {
      const newRes = {
        ...data,
        id: Date.now(),
        formCode: `BM7-${String(resources.length + 1).padStart(3, '0')}`,
        status: 'approved', // Admin thêm là duyệt luôn
        createdAt: new Date().toISOString().split('T')[0],
        uploadedBy: "Admin",
        role: "Quản trị viên"
      };
      setResources([newRes, ...resources]);
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>QUẢN LÝ NỘI BỘ</p>
          <h1>Kho Tài Liệu Học Thuật</h1>
          <p>Phê duyệt và quản lý hệ thống tài liệu theo quy định BM7 & BM8.</p>
        </div>
        <button className={styles.addBtn} onClick={() => { setEditing(null); setFormOpen(true); }}>
          + Thêm tài liệu mới
        </button>
      </header>

      <section className={styles.statsGrid}>
        <StatCard label="Tổng tài liệu" value={stats.total} icon="📚" color="blue" />
        <StatCard label="Chờ xét duyệt" value={stats.pending} icon="⏳" color="amber" />
        <StatCard label="Đã phát hành" value={stats.approved} icon="✅" color="green" />
      </section>

      <section className={styles.controlRow}>
        <div className={styles.searchBox}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input 
            type="text" 
            placeholder="Tìm theo tiêu đề hoặc mã phiếu (BM7)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <ResourceFilter 
          open={filterOpen}
          setOpen={setFilterOpen}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          formatFilter={formatFilter}
          setFormatFilter={setFormatFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showStatus={true}
        />
      </section>

      <div className={styles.tableContainer}>
        <ResourceTable 
          resources={filtered}
          onView={setSelected}
          onEdit={(r) => { setEditing(r); setFormOpen(true); }}
          onApprove={handleApprove}
          onReject={handleReject}
          isAdmin={true}
        />
      </div>

      {/* Modals */}
      <ResourceDetailModal
        resource={selected}
        onClose={() => setSelected(null)}
        isAdmin
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <ResourceForm
        open={formOpen}
        initial={editing}
        isAdmin
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}