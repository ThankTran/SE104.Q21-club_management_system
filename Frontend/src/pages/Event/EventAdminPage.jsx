import { useState, useMemo } from 'react';
import EventCard from '../../components/sections/Event/EventCard';
import EventForm from '../../components/sections/Event/EventForm';
import styles from './EventAdminPage.module.css';

// ── Mock data ────────────────────────────────────────────────
const MOCK_EVENTS = [
  { id: 1,  title: 'Workshop An ninh mạng',              location: 'Lab Hall A',            date: '2024-10-24', time: '08:00', estimatedCost: 12500000, status: 'published', tag: 'TECH',   capacity: 150, attendance: 124, description: 'Workshop về bảo mật hệ thống và an ninh mạng.' },
  { id: 2,  title: 'Chiến lược Metadata 101',            location: 'Remote Access',         date: '2024-11-12', time: '09:00', estimatedCost: 4200000,  status: 'draft',     tag: 'ACAD',   capacity: 200, attendance: 0,   description: 'Khoá học trực tuyến về chiến lược metadata.' },
  { id: 3,  title: 'Dạ tiệc Kết nối Mùa hè',             location: 'Khuôn viên trường',     date: '2024-08-05', time: '18:00', estimatedCost: 8900000,  status: 'completed', tag: 'SOCIAL', capacity: 450, attendance: 450, description: 'Sự kiện giao lưu cuối hè của CLB.' },
  { id: 4,  title: 'Hội thảo Nghiên cứu Khoa học',       location: 'Hội trường A',          date: '2024-12-10', time: '08:00', estimatedCost: 15000000, status: 'upcoming',  tag: 'ACAD',   capacity: 300, attendance: 0,   description: 'Hội thảo nghiên cứu khoa học thường niên.' },
  { id: 5,  title: 'Chứng chỉ Phân tích Dữ liệu',        location: 'Phòng máy tính C101',   date: '2024-09-20', time: '08:00', estimatedCost: 6000000,  status: 'completed', tag: 'CERT',   capacity: 30,  attendance: 28,  description: 'Khoá học Python data analysis.' },
  { id: 6,  title: 'Talkshow Khởi nghiệp Công nghệ',     location: 'Hội trường B',          date: '2024-11-18', time: '14:00', estimatedCost: 7000000,  status: 'published', tag: 'TECH',   capacity: 220, attendance: 176, description: 'Chia sẻ từ startup founder và CEO.' },
  { id: 7,  title: 'Workshop Git & GitHub',              location: 'Phòng Lab B202',        date: '2024-10-29', time: '13:30', estimatedCost: 3500000,  status: 'published', tag: 'TECH',   capacity: 80,  attendance: 67,  description: 'Hướng dẫn teamwork và quản lý source code.' },
  { id: 8,  title: 'Ngày hội Việc làm CNTT',             location: 'Sảnh chính',            date: '2024-11-25', time: '09:00', estimatedCost: 18000000, status: 'upcoming',  tag: 'SOCIAL', capacity: 500, attendance: 0,   description: 'Kết nối sinh viên với doanh nghiệp.' },
  { id: 9,  title: 'Khóa học TOEIC Cấp tốc',             location: 'Phòng B105',            date: '2024-10-15', time: '18:00', estimatedCost: 5200000,  status: 'completed', tag: 'CERT',   capacity: 100, attendance: 91,  description: 'Luyện thi TOEIC cho sinh viên.' },
  { id: 10, title: 'Seminar Trí tuệ Nhân tạo',           location: 'Phòng D301',            date: '2024-12-12', time: '14:00', estimatedCost: 9500000,  status: 'upcoming',  tag: 'ACAD',   capacity: 180, attendance: 0,   description: 'Cập nhật xu hướng AI hiện đại.' },
  { id: 11, title: 'Workshop UI/UX Design',              location: 'Phòng C204',            date: '2024-11-08', time: '15:00', estimatedCost: 4800000,  status: 'published', tag: 'TECH',   capacity: 60,  attendance: 51,  description: 'Thực hành thiết kế giao diện hiện đại.' },
  { id: 12, title: 'Diễn đàn Chuyển đổi số',             location: 'Hội trường lớn',        date: '2024-12-05', time: '09:30', estimatedCost: 13200000, status: 'upcoming',  tag: 'ACAD',   capacity: 320, attendance: 0,   description: 'Thảo luận xu hướng chuyển đổi số.' },
  { id: 13, title: 'Workshop CV & Phỏng vấn',            location: 'Phòng A102',            date: '2024-10-20', time: '13:00', estimatedCost: 2600000,  status: 'completed', tag: 'SOCIAL', capacity: 90,  attendance: 83,  description: 'Chuẩn bị CV và kỹ năng phỏng vấn.' },
  { id: 14, title: 'Hackathon 24h Sinh viên',            location: 'Innovation Lab',        date: '2024-11-30', time: '08:00', estimatedCost: 21000000, status: 'upcoming',  tag: 'TECH',   capacity: 120, attendance: 0,   description: 'Cuộc thi sáng tạo giải pháp công nghệ.' },
  { id: 15, title: 'Khóa học MOS Word',                  location: 'Phòng máy A101',        date: '2024-09-28', time: '08:30', estimatedCost: 4300000,  status: 'completed', tag: 'CERT',   capacity: 40,  attendance: 36,  description: 'Ôn luyện chứng chỉ MOS Word.' },
  { id: 16, title: 'Giải bóng đá Sinh viên',             location: 'Sân vận động',          date: '2024-12-14', time: '07:00', estimatedCost: 9800000,  status: 'upcoming',  tag: 'SOCIAL', capacity: 260, attendance: 0,   description: 'Giải đấu giao lưu giữa các khoa.' },
  { id: 17, title: 'Seminar Cloud Computing',            location: 'Phòng D105',            date: '2024-11-21', time: '10:00', estimatedCost: 6100000,  status: 'published', tag: 'ACAD',   capacity: 140, attendance: 112, description: 'Tìm hiểu điện toán đám mây.' },
  { id: 18, title: 'Workshop Python nâng cao',           location: 'Lab C201',              date: '2024-12-16', time: '13:30', estimatedCost: 5600000,  status: 'upcoming',  tag: 'TECH',   capacity: 70,  attendance: 0,   description: 'Python nâng cao cho data analysis.' },
  { id: 19, title: 'Đêm nhạc Acoustic Sinh viên',        location: 'Sân trường',            date: '2024-12-18', time: '19:00', estimatedCost: 7600000,  status: 'upcoming',  tag: 'SOCIAL', capacity: 350, attendance: 0,   description: 'Đêm nhạc giao lưu thư giãn.' },
  { id: 20, title: 'Lễ Tổng kết Cuối năm',              location: 'Hội trường A',          date: '2024-12-28', time: '17:30', estimatedCost: 14500000, status: 'upcoming',  tag: 'SOCIAL', capacity: 500, attendance: 0,   description: 'Tổng kết hoạt động và trao thưởng.' },
];

const STATUS_LABEL = {
  published: { label: 'ĐÃ CÔNG BỐ', bg: '#e6f4ea', color: '#276749' },
  draft:     { label: 'NHÁP',       bg: '#e8ecf2', color: '#3a4a5c' },
  completed: { label: 'ĐÃ KẾT THÚC', bg: '#ede8f8', color: '#5b3fa8' },
  upcoming:  { label: 'SẮP TỚI',    bg: '#e0f0ff', color: '#1a6b8a' },
  cancelled: { label: 'ĐÃ HUỶ',     bg: '#fff0f0', color: '#e53e3e' },
};

const PAGE_SIZE = 5;

export default function EventAdminPage() {
  const [events, setEvents]           = useState(MOCK_EVENTS);
  const [search, setSearch]           = useState('');
  const [formOpen, setFormOpen]       = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [page, setPage]               = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Stats ────────────────────────────────────────────────
  const totalEstimated = events.reduce((s, e) => s + (Number(e.estimatedCost) || 0), 0);
  const totalActual    = events
    .filter((e) => e.status === 'completed')
    .reduce((s, e) => s + (Number(e.estimatedCost) * 0.9 || 0), 0); // mock: actual = 90% estimated
  const publishedCount = events.filter((e) => e.status === 'published').length;

  // ── Filter ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q),
    );
  }, [events, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Handlers ─────────────────────────────────────────────
  const openAdd  = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (event) => { setEditTarget(event); setFormOpen(true); };

  const handleSubmit = (formData) => {
    setFormLoading(true);
    setTimeout(() => {
      if (editTarget) {
        setEvents((prev) =>
          prev.map((e) => (e.id === editTarget.id ? { ...e, ...formData } : e)),
        );
      } else {
        const newId = Math.max(...events.map((e) => e.id)) + 1;
        setEvents((prev) => [
          { ...formData, id: newId, attendance: 0, status: 'draft' },
          ...prev,
        ]);
      }
      setFormLoading(false);
      setFormOpen(false);
    }, 800);
  };

  const handleDelete = (event) => setDeleteConfirm(event);
  const confirmDelete = () => {
    setEvents((prev) => prev.filter((e) => e.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý Sự kiện</h1>
          <p className={styles.pageSubtitle}>Tổ chức, theo dõi và quản lý các sự kiện học thuật của câu lạc bộ.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Xuất dữ liệu
          </button>
          <button className={styles.addBtn} onClick={openAdd}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Sự kiện mới
          </button>
        </div>
      </div>

      {/* ── Fiscal Performance ── */}
      <div className={styles.fiscalCard}>
        <div className={styles.fiscalHeader}>
          <h2 className={styles.fiscalTitle}>Hiệu suất Tài chính</h2>
          <span className={styles.fiscalTag}>↗ Tổng quan Q4</span>
        </div>
        <div className={styles.fiscalNumbers}>
          <div>
            <p className={styles.fiscalLabel}>NGÂN SÁCH DỰ KIẾN</p>
            <p className={styles.fiscalValue}>{totalEstimated.toLocaleString('vi-VN')}₫</p>
          </div>
          <div>
            <p className={styles.fiscalLabel}>CHI PHÍ THỰC TẾ</p>
            <p className={`${styles.fiscalValue} ${styles.fiscalActual}`}>
              {Math.round(totalActual).toLocaleString('vi-VN')}₫
            </p>
          </div>
          <div className={styles.fiscalMeta}>
            <p className={styles.fiscalNote}>
              Chi phí thực tế thấp hơn ~10% so với dự toán.
            </p>
          </div>
        </div>
        <div className={styles.fiscalBar}>
          <div
            className={styles.fiscalBarFill}
            style={{ width: `${totalEstimated > 0 ? Math.min(100, (totalActual / totalEstimated) * 100) : 0}%` }}
          />
        </div>
      </div>

      {/* ── Operational Roster ── */}
      <div className={styles.rosterCard}>
        <div className={styles.rosterHeader}>
          <h2 className={styles.rosterTitle}>Danh sách Sự kiện</h2>
          <div className={styles.rosterActions}>
            <div className={styles.searchWrap}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className={styles.searchInput}
                placeholder="Tìm sự kiện..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <span className={styles.publishedBadge}>{publishedCount} đã công bố</span>
          </div>
        </div>

        {/* Table */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>TÊN SỰ KIỆN</th>
              <th>TRẠNG THÁI</th>
              <th>NGÀY</th>
              <th>THAM DỰ</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((event) => {
              const ss  = STATUS_LABEL[event.status] || STATUS_LABEL.upcoming;
              const d   = new Date(event.date);
              const pct = event.capacity > 0
                ? Math.round((event.attendance / event.capacity) * 100)
                : 0;

              return (
                <tr key={event.id} className={styles.row}>
                  <td>
                    <p className={styles.eventName}>{event.title}</p>
                    <p className={styles.eventLocation}>{event.location}</p>
                  </td>
                  <td>
                    <span className={styles.statusBadge} style={{ background: ss.bg, color: ss.color }}>
                      {ss.label}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <span className={styles.attendance}>
                      {event.attendance} / {event.capacity}
                    </span>
                    <div className={styles.attBar}>
                      <div className={styles.attBarFill} style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.editBtn} onClick={() => openEdit(event)} title="Chỉnh sửa">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button className={styles.downloadBtn} title="Xuất">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(event)} title="Xoá">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            {filtered.length} sự kiện
          </span>
          <div className={styles.paginationBtns}>
            <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        </div>
      </div>

      {/* ── FAB ── */}
      <button className={styles.fab} onClick={openAdd} title="Tạo sự kiện mới">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      {/* ── EventForm modal ── */}
      <EventForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
        loading={formLoading}
      />

      {/* ── Delete confirm ── */}
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
            <h3 className={styles.confirmTitle}>Xoá sự kiện?</h3>
            <p className={styles.confirmMsg}>
              Bạn có chắc muốn xoá <strong>{deleteConfirm.title}</strong>? Hành động này không thể hoàn tác.
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