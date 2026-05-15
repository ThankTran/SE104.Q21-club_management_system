import { useMemo, useState } from "react";
import ResourceForm from "../../components/sections/Resource/ResourceForm";
import ResourceDetailModal from "../../components/sections/Resource/ResourceDetailModal";
import ResourceTable from "../../components/sections/Resource/ResourceTable";
import ResourceFilter from "../../components/sections/Resource/ResourceFilter";
import styles from "./ResourceAdminPage.module.css";

// ── Mock data theo đúng cấu trúc BM7 ─────────────────────────
const INITIAL_RESOURCES = [
  {
    id: 1,
    formCode: "BM7-001",
    title: "Giáo trình OOP",
    subject: "Lập trình hướng đối tượng",
    type: "Giáo trình",
    format: "PDF",
    source: "Giảng viên cung cấp",
    description: "Tài liệu OOP học kỳ 1.",
    link: "https://drive.google.com/1",
    // Thông tin người đề xuất (BM7 - Mục I)
    uploadedBy: "Nguyễn Minh Anh",
    memberId: "TV001",
    memberRole: "Thành viên",
    // Thông tin xét duyệt (BM7 - Mục IV)
    reviewedBy: "Admin",
    reviewedAt: "2024-12-11",
    note: "Đạt yêu cầu",
    createdAt: "2024-12-10",
    status: "approved",
  },
  {
    id: 2,
    formCode: "BM7-002",
    title: "Slide CSDL chương 1-5",
    subject: "Cơ sở dữ liệu",
    type: "Slide bài giảng",
    format: "PPT",
    source: "Giảng viên cung cấp",
    description: "Slide ERD và SQL cơ bản.",
    link: "https://drive.google.com/2",
    uploadedBy: "Trần Quốc Bảo",
    memberId: "TV002",
    memberRole: "Ban học tập",
    reviewedBy: "",
    reviewedAt: "",
    note: "",
    createdAt: "2024-12-08",
    status: "pending",
  },
  {
    id: 3,
    formCode: "BM7-003",
    title: "Tài liệu tham khảo Mạng máy tính",
    subject: "Mạng máy tính",
    type: "Tài liệu tham khảo",
    format: "PDF",
    source: "Internet",
    description: "Tổng hợp lý thuyết TCP/IP.",
    link: "https://drive.google.com/3",
    uploadedBy: "Lê Hoàng Nam",
    memberId: "TV003",
    memberRole: "Thành viên",
    reviewedBy: "",
    reviewedAt: "",
    note: "",
    createdAt: "2024-12-05",
    status: "pending",
  },
  {
    id: 4,
    formCode: "BM7-004",
    title: "Giáo trình Giải tích 1",
    subject: "Giải tích 1",
    type: "Giáo trình",
    format: "PDF",
    source: "Giảng viên cung cấp",
    description: "Giáo trình Giải tích 1.",
    link: "https://drive.google.com/4",
    uploadedBy: "Phạm Gia Hân",
    memberId: "TV004",
    memberRole: "Thành viên",
    reviewedBy: "Admin",
    reviewedAt: "2024-12-02",
    note: "",
    createdAt: "2024-12-01",
    status: "approved",
  },
  {
    id: 5,
    formCode: "BM7-005",
    title: "Slide CSDL chương 1-5",
    subject: "Cơ sở dữ liệu",
    type: "Slide bài giảng",
    format: "PPT",
    source: "Tự biên soạn",
    description: "Slide nâng cao về CSDL.",
    link: "https://drive.google.com/5",
    uploadedBy: "Võ Đức Tài",
    memberId: "TV005",
    memberRole: "Thành viên",
    reviewedBy: "",
    reviewedAt: "",
    note: "",
    createdAt: "2024-11-28",
    status: "rejected",
  },
];

// BM8: Tối đa 20 tài liệu một lần tra cứu (QĐ8.2)
const BM8_MAX_DISPLAY = 20;

// ── Hằng số quy định ─────────────────────────────────────────
const QD_RULES = {
  "QĐ7.1": "Tên tài liệu không được để trống",
  "QĐ7.2": "Mỗi tài liệu phải thuộc một chủ đề/môn học xác định",
  "QĐ7.3": "Không cho phép tồn tại hai tài liệu có cùng tên và cùng đường dẫn",
  "QĐ7.4": "Chỉ thành viên trong câu lạc bộ mới được lập phiếu thêm tài liệu",
  "QĐ7.5": "Ngày duyệt phải lớn hơn hoặc bằng ngày lập phiếu",
  "QĐ8.1": "Kết quả tra cứu chỉ hiển thị các tài liệu ở trạng thái đã duyệt",
  "QĐ8.2": `Một lần tra cứu hiển thị tối đa ${BM8_MAX_DISPLAY} tài liệu`,
  "QĐ8.3": "Danh sách kết quả được sắp xếp theo thời gian thêm tài liệu (mới nhất trước)",
};

const STATUS_CONFIG = {
  pending:  { label: "Chờ duyệt",  bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  approved: { label: "Đã duyệt",   bg: "#dcfce7", color: "#15803d", dot: "#16a34a" },
  rejected: { label: "Từ chối",    bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
};

const FORMAT_ICON = {
  PDF:  { icon: "📄", bg: "#fee2e2", color: "#b91c1c" },
  DOCX: { icon: "📝", bg: "#dbeafe", color: "#1d4ed8" },
  PPT:  { icon: "📊", bg: "#fef3c7", color: "#b45309" },
  Khác: { icon: "📎", bg: "#f3e8ff", color: "#7c3aed" },
};

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIconWrap}>{icon}</div>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
        {sub && <p className={styles.statSub}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Phiếu BM7 Modal (chi tiết theo đúng biểu mẫu) ────────────
function BM7DetailModal({ resource, onClose, onApprove, onReject }) {
  if (!resource) return null;

  const fmt = FORMAT_ICON[resource.format] || FORMAT_ICON["Khác"];
  const ss  = STATUS_CONFIG[resource.status] || STATUS_CONFIG.pending;

  const canApprove = resource.status === "pending";

  const handleApprove = () => {
    // QĐ7.5: Ngày duyệt >= ngày lập phiếu — tự động dùng ngày hôm nay
    const today = new Date().toISOString().split("T")[0];
    onApprove(resource.id, today);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.bm7Modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className={styles.bm7Header}>
          <div>
            <div className={styles.bm7HeaderTop}>
              <span className={styles.bm7BanLabel}>Ban phụ trách: Ban học tập</span>
              <span className={styles.bm7Code}>{resource.formCode}</span>
            </div>
            <h2 className={styles.bm7Title}>PHIẾU THÊM TÀI LIỆU HỌC THUẬT</h2>
            <p className={styles.bm7Date}>
              Ngày lập phiếu: {resource.createdAt
                ? new Date(resource.createdAt).toLocaleDateString("vi-VN")
                : "—"}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.bm7Body}>
          {/* Mục I: Thông tin người đề xuất */}
          <div className={styles.bm7Section}>
            <div className={styles.bm7SectionTitle}>I. Thông tin người đề xuất</div>
            <div className={styles.bm7Grid2}>
              <InfoRow label="Họ và tên" value={resource.uploadedBy} />
              <InfoRow label="Mã thành viên" value={resource.memberId} />
              <InfoRow label="Chức vụ" value={resource.memberRole || "—"} />
            </div>
          </div>

          {/* Mục II: Thông tin tài liệu */}
          <div className={styles.bm7Section}>
            <div className={styles.bm7SectionTitle}>II. Thông tin tài liệu</div>

            <InfoRow label="Tên tài liệu" value={resource.title} fullWidth />
            <InfoRow label="Môn học / Chủ đề" value={resource.subject} fullWidth />

            <div className={styles.bm7Grid3}>
              {/* Loại tài liệu */}
              <div>
                <p className={styles.infoLabel}>Loại tài liệu</p>
                <div className={styles.checkboxGroup}>
                  {["Giáo trình", "Slide bài giảng", "Tài liệu tham khảo", "Khác"].map((t) => (
                    <label key={t} className={styles.checkboxItem}>
                      <span className={`${styles.checkbox} ${resource.type === t ? styles.checkboxChecked : ""}`}>
                        {resource.type === t ? "☑" : "☐"}
                      </span>
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              {/* Định dạng */}
              <div>
                <p className={styles.infoLabel}>Định dạng</p>
                <div className={styles.checkboxGroup}>
                  {["PDF", "DOCX", "PPT", "Khác"].map((f) => (
                    <label key={f} className={styles.checkboxItem}>
                      <span className={`${styles.checkbox} ${resource.format === f ? styles.checkboxChecked : ""}`}>
                        {resource.format === f ? "☑" : "☐"}
                      </span>
                      {f}
                    </label>
                  ))}
                </div>
              </div>

              {/* Nguồn tài liệu */}
              <div>
                <p className={styles.infoLabel}>Nguồn tài liệu</p>
                <div className={styles.checkboxGroup}>
                  {["Tự biên soạn", "Internet", "Giảng viên cung cấp", "Khác"].map((s) => (
                    <label key={s} className={styles.checkboxItem}>
                      <span className={`${styles.checkbox} ${resource.source === s ? styles.checkboxChecked : ""}`}>
                        {resource.source === s ? "☑" : "☐"}
                      </span>
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {resource.description && (
              <div style={{ marginTop: 12 }}>
                <p className={styles.infoLabel}>Mô tả ngắn nội dung tài liệu</p>
                <p className={styles.infoDesc}>{resource.description}</p>
              </div>
            )}
          </div>

          {/* Mục III: Đường dẫn */}
          <div className={styles.bm7Section}>
            <div className={styles.bm7SectionTitle}>III. Đường dẫn / Tệp đính kèm</div>
            <div className={styles.linkRow}>
              <span className={styles.infoLabel} style={{ marginBottom: 0 }}>Link lưu trữ:</span>
              {resource.status === "approved" ? (
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                  🔗 Mở tài liệu
                </a>
              ) : (
                <span className={styles.linkPending}>{resource.link || "—"}</span>
              )}
            </div>
          </div>

          {/* Mục IV: Xét duyệt */}
          <div className={styles.bm7Section}>
            <div className={styles.bm7SectionTitle}>IV. Xét duyệt</div>
            <div className={styles.bm7Grid2}>
              <InfoRow label="Người xét duyệt" value={resource.reviewedBy || "—"} />
              <InfoRow
                label="Trạng thái"
                value={
                  <span
                    className={styles.statusBadge}
                    style={{ background: ss.bg, color: ss.color }}
                  >
                    <span className={styles.statusDot} style={{ background: ss.dot }} />
                    {ss.label}
                  </span>
                }
              />
              <InfoRow
                label="Ngày duyệt"
                value={
                  resource.reviewedAt
                    ? new Date(resource.reviewedAt).toLocaleDateString("vi-VN")
                    : "—"
                }
              />
              <InfoRow label="Ghi chú" value={resource.note || "—"} />
            </div>

            {/* Quy định QĐ7.5 */}
            {resource.status === "pending" && (
              <p className={styles.ruleNote}>
                ⚠ QĐ7.5: Ngày duyệt sẽ tự động ghi nhận là ngày hiện tại (phải ≥ ngày lập phiếu).
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {canApprove && (
          <div className={styles.bm7Actions}>
            <button className={styles.rejectActionBtn} onClick={() => onReject(resource.id)}>
              ✕ Từ chối
            </button>
            <button className={styles.approveActionBtn} onClick={handleApprove}>
              ✓ Duyệt tài liệu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, fullWidth }) {
  return (
    <div className={`${styles.infoRow} ${fullWidth ? styles.infoRowFull : ""}`}>
      <p className={styles.infoLabel}>{label}</p>
      <p className={styles.infoValue}>{value || "—"}</p>
    </div>
  );
}

// ── Quy Định Panel ───────────────────────────────────────────
function QuyDinhPanel({ open, onClose }) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.qdModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.qdHeader}>
          <h2>Biểu mẫu & Quy định</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.qdBody}>
          <div className={styles.qdSection}>
            <h3>BM7 – Phiếu thêm tài liệu học thuật</h3>
            {["QĐ7.1", "QĐ7.2", "QĐ7.3", "QĐ7.4", "QĐ7.5"].map((key) => (
              <div key={key} className={styles.qdItem}>
                <span className={styles.qdCode}>{key}</span>
                <span className={styles.qdText}>{QD_RULES[key]}</span>
              </div>
            ))}
          </div>
          <div className={styles.qdSection}>
            <h3>BM8 – Tra cứu kho tài liệu</h3>
            {["QĐ8.1", "QĐ8.2", "QĐ8.3"].map((key) => (
              <div key={key} className={styles.qdItem}>
                <span className={styles.qdCode}>{key}</span>
                <span className={styles.qdText}>{QD_RULES[key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BM8: Bảng tra cứu tài liệu đã duyệt ─────────────────────
function BM8TraCuu({ resources, search }) {
  // QĐ8.1: Chỉ hiển thị đã duyệt
  // QĐ8.3: Sắp xếp mới nhất trước
  const filtered = resources
    .filter((r) => r.status === "approved")
    .filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, BM8_MAX_DISPLAY); // QĐ8.2: Tối đa 20

  return (
    <div className={styles.bm8Wrap}>
      <div className={styles.bm8Header}>
        <h3 className={styles.bm8Title}>
          BM8 – Danh sách tài liệu học thuật (Đã duyệt)
        </h3>
        <div className={styles.bm8Rules}>
          <span title={QD_RULES["QĐ8.1"]}>QĐ8.1</span>
          <span title={QD_RULES["QĐ8.2"]}>QĐ8.2: tối đa {BM8_MAX_DISPLAY}</span>
          <span title={QD_RULES["QĐ8.3"]}>QĐ8.3: mới nhất trước</span>
        </div>
      </div>
      <table className={styles.bm8Table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên tài liệu</th>
            <th>Chủ đề / Môn học</th>
            <th>Loại tài liệu</th>
            <th>Định dạng</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.emptyCell}>
                Không có tài liệu đã duyệt nào
              </td>
            </tr>
          ) : (
            filtered.map((r, i) => {
              const fmt = FORMAT_ICON[r.format] || FORMAT_ICON["Khác"];
              return (
                <tr key={r.id}>
                  <td className={styles.sttCell}>{i + 1}</td>
                  <td className={styles.titleCell}>{r.title}</td>
                  <td>{r.subject}</td>
                  <td>{r.type}</td>
                  <td>
                    <span
                      className={styles.fmtBadge}
                      style={{ background: fmt.bg, color: fmt.color }}
                    >
                      {fmt.icon} {r.format}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <p className={styles.bm8Count}>
        Hiển thị {filtered.length} / {resources.filter((r) => r.status === "approved").length} tài liệu đã duyệt
      </p>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function ResourceAdminPage() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Các tab: quản lý (BM7) và tra cứu (BM8)
  const [activeTab, setActiveTab] = useState("bm7"); // "bm7" | "bm8"

  // Modal states
  const [selected, setSelected] = useState(null);   // BM7 detail modal
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [qdOpen, setQdOpen] = useState(false);

  // Xác nhận xóa
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Thống kê
  const stats = useMemo(() => ({
    total: resources.length,
    pending: resources.filter((r) => r.status === "pending").length,
    approved: resources.filter((r) => r.status === "approved").length,
    rejected: resources.filter((r) => r.status === "rejected").length,
  }), [resources]);

  // Danh sách môn học duy nhất
  const subjects = useMemo(
    () => [...new Set(resources.map((r) => r.subject))].sort(),
    [resources]
  );

  // Lọc BM7
  const filtered = resources.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.title.toLowerCase().includes(q) ||
      r.formCode.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || r.type === typeFilter;
    const matchFormat = formatFilter === "all" || r.format === formatFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchSubject = subjectFilter === "all" || r.subject === subjectFilter;
    return matchSearch && matchType && matchFormat && matchStatus && matchSubject;
  });

  // Duyệt tài liệu — QĐ7.5: ghi ngày duyệt >= ngày lập phiếu
  const handleApprove = (id, reviewedAt) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "approved", reviewedBy: "Admin", reviewedAt, note: "" }
          : r
      )
    );
    setSelected(null);
  };

  const handleReject = (id) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected", reviewedBy: "Admin", reviewedAt: new Date().toISOString().split("T")[0] } : r))
    );
    setSelected(null);
  };

  const handleDelete = (r) => setDeleteTarget(r);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setResources((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Submit form (thêm / chỉnh sửa) với kiểm tra quy định BM7
  const handleSubmit = (data) => {
    // QĐ7.1: Tên không được để trống (đã validate trong form)
    // QĐ7.2: Phải có chủ đề (đã validate trong form)
    // QĐ7.3: Không trùng tên + link
    const isDuplicate = resources.some(
      (r) =>
        r.title.trim() === data.title.trim() &&
        r.link.trim() === data.link.trim() &&
        r.id !== editing?.id
    );
    if (isDuplicate) {
      alert(`Vi phạm QĐ7.3: "${data.title}" với đường dẫn này đã tồn tại trong hệ thống!`);
      return;
    }

    if (editing) {
      setResources((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r))
      );
    } else {
      const newRes = {
        ...data,
        id: Date.now(),
        formCode: `BM7-${String(resources.length + 1).padStart(3, "0")}`,
        status: "approved",
        createdAt: new Date().toISOString().split("T")[0],
        reviewedAt: new Date().toISOString().split("T")[0],
        uploadedBy: "Admin",
        memberId: "ADMIN",
        memberRole: "Quản trị viên",
        reviewedBy: "Admin",
        note: "Thêm trực tiếp bởi admin",
      };
      setResources([newRes, ...resources]);
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>QUẢN LÝ NỘI BỘ · BM7 & BM8</p>
          <h1 className={styles.heroTitle}>Kho Tài Liệu Học Thuật</h1>
          <p className={styles.heroSub}>
            Quản lý phiếu thêm tài liệu (BM7) và tra cứu kho tài liệu (BM8) theo đúng quy định câu lạc bộ.
          </p>
        </div>
        <div className={styles.heroActions}>
          <button className={styles.qdBtn} onClick={() => setQdOpen(true)}>
            📋 Xem Biểu mẫu & Quy định
          </button>
          <button
            className={styles.addBtn}
            onClick={() => { setEditing(null); setFormOpen(true); }}
          >
            + Thêm tài liệu mới
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <StatCard label="Tổng phiếu BM7" value={stats.total} icon="📚" color="blue" />
        <StatCard label="Chờ xét duyệt" value={stats.pending} icon="⏳" color="amber" sub="Cần xử lý" />
        <StatCard label="Đã duyệt" value={stats.approved} icon="✅" color="green" sub="Hiển thị trong BM8" />
        <StatCard label="Từ chối" value={stats.rejected} icon="❌" color="red" />
      </div>

      {/* ── Tab Bar ── */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "bm7" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("bm7")}
        >
          📝 BM7 – Quản lý phiếu tài liệu
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "bm8" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("bm8")}
        >
          🔍 BM8 – Tra cứu kho tài liệu
          <span className={styles.tabBadge}>{stats.approved}</span>
        </button>
      </div>

      {/* ── BM7: Quản lý phiếu ── */}
      {activeTab === "bm7" && (
        <>
          {/* Control Row */}
          <div className={styles.controlRow}>
            <div className={styles.searchBox}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Tìm theo tên tài liệu, mã phiếu, môn học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className={styles.clearSearch} onClick={() => setSearch("")}>✕</button>
              )}
            </div>

            <ResourceFilter
              open={filterOpen}
              setOpen={setFilterOpen}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              formatFilter={formatFilter}
              setFormatFilter={setFormatFilter}
              subjectFilter={subjectFilter}
              setSubjectFilter={setSubjectFilter}
              subjects={subjects}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              showStatus={true}
            />

            {/* Quick status filter pills */}
            <div className={styles.statusPills}>
              {[
                { key: "all", label: "Tất cả" },
                { key: "pending",  label: "⏳ Chờ duyệt" },
                { key: "approved", label: "✅ Đã duyệt"  },
                { key: "rejected", label: "❌ Từ chối"   },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`${styles.statusPill} ${statusFilter === key ? styles.statusPillActive : ""}`}
                  onClick={() => setStatusFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Bảng BM7 */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeaderRow}>
              <span className={styles.tableCount}>{filtered.length} phiếu</span>
            </div>
            <ResourceTable
              resources={filtered}
              total={filtered.length}
              page={1}
              totalPages={1}
              pageSize={filtered.length}
              onPageChange={() => {}}
              onView={setSelected}
              onEdit={(r) => { setEditing(r); setFormOpen(true); }}
              onApprove={(id) => handleApprove(id, new Date().toISOString().split("T")[0])}
              onReject={handleReject}
              onDelete={handleDelete}
              isAdmin={true}
              loading={false}
            />
          </div>
        </>
      )}

      {/* ── BM8: Tra cứu ── */}
      {activeTab === "bm8" && (
        <div className={styles.bm8Container}>
          <BM8TraCuu resources={resources} search={search} />
        </div>
      )}

      {/* ── BM7 Detail Modal ── */}
      <BM7DetailModal
        resource={selected}
        onClose={() => setSelected(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* ── Add/Edit Form ── */}
      <ResourceForm
        open={formOpen}
        initial={editing}
        isAdmin={true}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />

      {/* ── Quy Định Panel ── */}
      <QuyDinhPanel open={qdOpen} onClose={() => setQdOpen(false)} />

      {/* ── Confirm Delete ── */}
      {deleteTarget && (
        <div className={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>⚠️</div>
            <h3 className={styles.confirmTitle}>Xoá phiếu BM7?</h3>
            <p className={styles.confirmMsg}>
              Bạn có chắc muốn xoá phiếu <strong>{deleteTarget.formCode}</strong> —{" "}
              <em>{deleteTarget.title}</em>? Hành động này không thể hoàn tác.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancelBtn} onClick={() => setDeleteTarget(null)}>Huỷ</button>
              <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>Xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}