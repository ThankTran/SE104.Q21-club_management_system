import { useState, useMemo } from 'react';
import ResourceCard from '../../components/sections/Resource/ResourceCard';
import ResourceForm from '../../components/sections/Resource/ResourceForm';
import ResourceFolderView from '../../components/sections/Resource/ResourceFolderView';
import { RESOURCE_LEAF_FOLDERS } from '../../components/sections/Resource/resourceFolderData';

import styles from './ResourceUserPage.module.css';

// ── Mock data ─────────────────────────────────────────────────
const MOCK_RESOURCES = [
  { id: 1, title: 'Giáo trình Lập trình hướng đối tượng', category: 'major', major: 'Công nghệ phần mềm', subject: 'Lập trình hướng đối tượng', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'Tài liệu chính thức môn OOP dùng trong học kỳ 1.', link: '#', uploadedBy: 'Nguyễn Minh Anh', createdAt: '2024-12-10', status: 'approved' },
  { id: 2, title: 'Slide Cơ sở dữ liệu – Chương 1 đến 5', category: 'major', major: 'Hệ thống thông tin', subject: 'Cơ sở dữ liệu', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'Slide bài giảng môn CSDL.', link: '#', uploadedBy: 'Trần Quốc Bảo', createdAt: '2024-12-08', status: 'approved' },
  { id: 3, title: 'Tài liệu tham khảo Mạng máy tính', category: 'major', major: 'Mạng máy tính và truyền thông', subject: 'Mạng máy tính', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Tổng hợp lý thuyết TCP/IP.', link: '#', uploadedBy: 'Lê Hoàng Nam', createdAt: '2024-12-05', status: 'approved' },
  { id: 4, title: 'Giáo trình Giải tích 1', category: 'general', major: null, subject: 'Giải tích 1', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'Giáo trình Giải tích 1.', link: '#', uploadedBy: 'Phạm Gia Hân', createdAt: '2024-12-01', status: 'approved' },
  { id: 5, title: 'Slide Kỹ thuật phần mềm – Agile & Scrum', category: 'major', major: 'Công nghệ phần mềm', subject: 'Kỹ thuật phần mềm', type: 'Slide bài giảng', format: 'PPT', source: 'Tự biên soạn', description: 'Agile và Scrum.', link: '#', uploadedBy: 'Võ Đức Tài', createdAt: '2024-11-28', status: 'approved' },
  { id: 6, title: 'Python cho Data Science – Hướng dẫn', category: 'major', major: 'Khoa học dữ liệu', subject: 'Khoa học dữ liệu', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Pandas và NumPy.', link: '#', uploadedBy: 'Nguyễn Khánh Linh', createdAt: '2024-11-25', status: 'approved' },
  { id: 7, title: 'Giáo trình Đại số tuyến tính', category: 'general', major: null, subject: 'Đại số tuyến tính', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'Ma trận và không gian vector.', link: '#', uploadedBy: 'Đặng Nhật Quang', createdAt: '2024-11-22', status: 'approved' },
  { id: 8, title: 'Slide An toàn thông tin – Chương 1-4', category: 'major', major: 'An toàn thông tin', subject: 'An toàn thông tin', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'Mã hóa và bảo mật.', link: '#', uploadedBy: 'Huỳnh Bảo Trân', createdAt: '2024-11-20', status: 'approved' },
  { id: 9, title: 'Tài liệu Git & GitHub thực hành', category: 'major', major: 'Công nghệ phần mềm', subject: 'Công cụ lập trình', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Git từ cơ bản đến nâng cao.', link: '#', uploadedBy: 'Trương Hải Đăng', createdAt: '2024-11-18', status: 'approved' },
  { id: 10, title: 'Giáo trình Kiến trúc máy tính', category: 'major', major: 'Kỹ thuật máy tính', subject: 'Kiến trúc máy tính', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'CPU và bộ nhớ.', link: '#', uploadedBy: 'Bùi Ngọc Mai', createdAt: '2024-11-15', status: 'approved' },
  { id: 11, title: 'React.js – Tài liệu học cơ bản', category: 'major', major: 'Công nghệ phần mềm', subject: 'Lập trình Web', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'React hooks và routing.', link: '#', uploadedBy: 'Lý Tuấn Kiệt', createdAt: '2024-11-12', status: 'approved' },
  { id: 12, title: 'Slide Trí tuệ nhân tạo – Giới thiệu AI', category: 'major', major: 'Khoa học máy tính', subject: 'Trí tuệ nhân tạo', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'Machine learning cơ bản.', link: '#', uploadedBy: 'Phan Thảo Vy', createdAt: '2024-11-10', status: 'approved' },
  { id: 13, title: 'Tổng hợp đề thi CSDL các năm', category: 'major', major: 'Hệ thống thông tin', subject: 'Cơ sở dữ liệu', type: 'Tài liệu tham khảo', format: 'DOCX', source: 'Tự biên soạn', description: 'Đề thi từ 2020–2024.', link: '#', uploadedBy: 'Ngô Gia Huy', createdAt: '2024-11-08', status: 'approved' },
  { id: 14, title: 'Docker & Container – Hướng dẫn thực tế', category: 'major', major: 'Công nghệ phần mềm', subject: 'DevOps', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Docker cơ bản.', link: '#', uploadedBy: 'Mai Thanh Tùng', createdAt: '2024-11-05', status: 'approved' },
  { id: 15, title: 'Slide Lập trình Web – HTML CSS JS', category: 'major', major: 'Thương mại điện tử', subject: 'Lập trình Web', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'HTML CSS JavaScript.', link: '#', uploadedBy: 'Đoàn Yến Nhi', createdAt: '2024-11-02', status: 'approved' },
  { id: 16, title: 'Giáo trình Xác suất thống kê', category: 'general', major: null, subject: 'Xác suất thống kê', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'Xác suất và thống kê.', link: '#', uploadedBy: 'Tạ Minh Khoa', createdAt: '2024-10-28', status: 'approved' },
  { id: 17, title: 'Node.js – Backend Development Guide', category: 'major', major: 'Công nghệ phần mềm', subject: 'Lập trình Web', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'REST API với Express.', link: '#', uploadedBy: 'Vũ Thành Công', createdAt: '2024-10-25', status: 'approved' },
  { id: 18, title: 'Tổng hợp đề thi Giải tích 1 – 2023', category: 'general', major: null, subject: 'Giải tích 1', type: 'Tài liệu tham khảo', format: 'DOCX', source: 'Tự biên soạn', description: 'Đề thi Giải tích 1.', link: '#', uploadedBy: 'Châu Bích Ngọc', createdAt: '2024-10-22', status: 'approved' },
  { id: 19, title: 'Slide Hệ điều hành – Chương 1-6', category: 'major', major: 'Khoa học máy tính', subject: 'Hệ điều hành', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'Process và Thread.', link: '#', uploadedBy: 'Nguyễn Quốc Hưng', createdAt: '2024-10-18', status: 'approved' },
  { id: 20, title: 'Tài liệu UI/UX Design Fundamentals', category: 'major', major: 'Thương mại điện tử', subject: 'Thiết kế giao diện', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Wireframe và prototype.', link: '#', uploadedBy: 'Lâm Gia Linh', createdAt: '2024-10-15', status: 'approved' },
];

const TYPE_TABS = ['Tất cả', 'Giáo trình', 'Slide bài giảng', 'Tài liệu tham khảo', 'Đề thi', 'Bài tập', 'Khác'];
const FORMAT_OPTIONS = ['Tất cả', 'PDF', 'DOCX', 'PPT', 'ZIP', 'PNG', 'Khác'];
const SOURCE_OPTIONS = ['Tất cả', 'Giảng viên cung cấp', 'Tự biên soạn', 'Internet', 'Sinh viên khóa trước', 'Khác'];

const PAGE_SIZE = 12;

export default function ResourceUserPage() {
  // Filters
  const [search, setSearch]       = useState('');
  const [activeType, setActiveType]     = useState('Tất cả');
  const [activeFormat, setActiveFormat] = useState('Tất cả');
  const [activeSource, setActiveSource] = useState('Tất cả');
  const [activeSubject, setActiveSubject] = useState('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedSubjectFolder, setSelectedSubjectFolder] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // UI state
  const [viewMode, setViewMode]   = useState('list'); // 'list' | 'grid'
  const [page, setPage]           = useState(1);
  const [formOpen, setFormOpen]   = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Derived data
  const subjects = useMemo(
    () => ['Tất cả', ...new Set(MOCK_RESOURCES.map((r) => r.subject))].sort((a, b) =>
      a === 'Tất cả' ? -1 : b === 'Tất cả' ? 1 : a.localeCompare(b)
    ),
    []
  );

  const selectedFolder = RESOURCE_LEAF_FOLDERS.find((folder) => folder.id === selectedFolderId);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return MOCK_RESOURCES
      .filter((r) => r.status === "approved")
      .filter((r) => {
        if (!selectedFolderId) return false;
        return resolveUserFolderId(r) === selectedFolderId;
      })
      .filter((r) => {
        const matchSearch =
          !q ||
          r.title.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.format.toLowerCase().includes(q);

        const matchType = activeType === "Tất cả" || r.type === activeType;
        const matchFormat = activeFormat === "Tất cả" || r.format === activeFormat;
        const matchSource = activeSource === "Tất cả" || r.source === activeSource;
        const matchSubject = activeSubject === "Tất cả" || r.subject === activeSubject;

        return matchSearch && matchType && matchFormat && matchSource && matchSubject;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [
    search,
    activeType,
    activeFormat,
    activeSource,
    activeSubject,
    selectedFolderId,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats
  const totalApproved = MOCK_RESOURCES.filter((r) => r.status === 'approved').length;
  const totalSubjects = new Set(MOCK_RESOURCES.map((r) => r.subject)).size;

  const hasFilter = activeType !== 'Tất cả' || activeFormat !== 'Tất cả' || activeSource !== 'Tất cả' || activeSubject !== 'Tất cả';

  const resetFilters = () => {
    setActiveType('Tất cả');
    setActiveFormat('Tất cả');
    setActiveSource('Tất cả');
    setActiveSubject('Tất cả');
    setSearch('');
    setPage(1);
  };

  const handleSubmitForm = (formData) => {
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormOpen(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }, 900);
  };

  const handleFilter = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  return (
    <div className={styles.page}>

      {/* ══ HERO BANNER ══ */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>📚 Kho học liệu</div>
            <h1 className={styles.heroTitle}>
              Tài liệu học thuật<br/>
              <span className={styles.heroAccent}>được kiểm duyệt</span>
            </h1>
            <p className={styles.heroSub}>
              Giáo trình, slide và tài liệu tham khảo từ giảng viên &amp; cộng đồng — miễn phí, đã xét duyệt.
            </p>
            <button className={styles.proposeBtn} onClick={() => setFormOpen(true)}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Đề xuất tài liệu
            </button>
          </div>

          {/* Stats pills */}
          <div className={styles.heroStats}>
            <StatPill icon="📄" value={totalApproved} label="Tài liệu" />
            <StatPill icon="📖" value={totalSubjects} label="Môn học" />
            <StatPill icon="✅" value="100%" label="Đã duyệt" />
          </div>
        </div>
      </div>

      {/* ══ TOAST ══ */}
      {submitted && (
        <div className={styles.toast}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7"/>
          </svg>
          Đề xuất đã gửi thành công! Admin sẽ xét duyệt trong 1–3 ngày làm việc.
        </div>
      )}

      {/* ══ MAIN LAYOUT: sidebar + content ══ */}
      <div className={styles.layout}>

        {/* ── SIDEBAR ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>

            {/* Search */}
            <div className={styles.searchBox}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className={styles.searchInput}
                placeholder="Tìm tài liệu, môn học..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
              {search && (
                <button className={styles.clearBtn} onClick={() => { setSearch(''); setPage(1); }}>✕</button>
              )}
            </div>

            {/* Loại tài liệu */}
            <FilterSection title="Loại tài liệu">
              {TYPE_TABS.map((t) => (
                <FilterOption
                  key={t}
                  label={t}
                  count={t === 'Tất cả' ? MOCK_RESOURCES.length : MOCK_RESOURCES.filter((r) => r.type === t).length}
                  active={activeType === t}
                  onClick={() => handleFilter(setActiveType)(t)}
                />
              ))}
            </FilterSection>

            {/* Định dạng */}
            <FilterSection title="Định dạng">
              {FORMAT_OPTIONS.map((f) => (
                <FilterOption
                  key={f}
                  label={f}
                  count={f === 'Tất cả' ? MOCK_RESOURCES.length : MOCK_RESOURCES.filter((r) => r.format === f).length}
                  active={activeFormat === f}
                  onClick={() => handleFilter(setActiveFormat)(f)}
                />
              ))}
            </FilterSection>

            {/* Nguồn */}
            <FilterSection title="Nguồn tài liệu">
              {SOURCE_OPTIONS.map((s) => (
                <FilterOption
                  key={s}
                  label={s}
                  count={s === 'Tất cả' ? MOCK_RESOURCES.length : MOCK_RESOURCES.filter((r) => r.source === s).length}
                  active={activeSource === s}
                  onClick={() => handleFilter(setActiveSource)(s)}
                />
              ))}
            </FilterSection>

            {/* Môn học */}
            <FilterSection title="Môn học">
              <div className={styles.subjectScroll}>
                {subjects.map((s) => (
                  <FilterOption
                    key={s}
                    label={s}
                    count={s === 'Tất cả' ? MOCK_RESOURCES.length : MOCK_RESOURCES.filter((r) => r.subject === s).length}
                    active={activeSubject === s}
                    onClick={() => handleFilter(setActiveSubject)(s)}
                    small
                  />
                ))}
              </div>
            </FilterSection>

            {/* Reset */}
            {hasFilter && (
              <button className={styles.resetBtn} onClick={resetFilters}>
                ✕ Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        </aside>

        {/* ── CONTENT ── */}
        <main className={styles.content}>
          {selectedFolder && (
                        <div className={styles.breadcrumbBar}>
              <button
                className={styles.backBtn}
                onClick={() => {
                  setSelectedFolderId(null);
                  setPage(1);
                }}
              >
                ← Quay lại
              </button>

              <div className={styles.breadcrumbs}>
                <button
                  className={styles.breadcrumbLink}
                  onClick={() => {
                    setSelectedFolderId(null);
                  }}
                >
                  Kho tài liệu
                </button>

                {selectedFolder && (
                  <>
                    <span className={styles.breadcrumbSep}>/</span>
                    <button className={`${styles.breadcrumbLink} ${styles.breadcrumbCurrent}`}>
                      {selectedFolder.pathLabel}
                    </button>
                  </>
                )}

                {selectedCategory && (
                  <>
                    <span className={styles.breadcrumbSep}>/</span>

                    <button
                      className={styles.breadcrumbLink}
                      onClick={() => {
                        setSelectedMajor(null);
                        setSelectedSubjectFolder(null);
                      }}
                    >
                      {selectedCategory === "general"
                        ? "Môn đại cương"
                        : "Môn theo ngành"}
                    </button>
                  </>
                )}

                {selectedMajor && (
                  <>
                    <span className={styles.breadcrumbSep}>/</span>

                    <button
                      className={`${styles.breadcrumbLink} ${styles.breadcrumbCurrent}`}
                    >
                      {selectedMajor}
                    </button>
                  </>
                )}

                {selectedSubjectFolder && (
                  <>
                    <span className={styles.breadcrumbSep}>/</span>

                    <button
                      className={`${styles.breadcrumbLink} ${styles.breadcrumbCurrent}`}
                    >
                      {selectedSubjectFolder}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {/* Folder view (chỉ hiện khi chưa chọn category hoặc major/subject) */}
          {!selectedFolderId && (
            <ResourceFolderView
              selectedFolderId={selectedFolderId}
              onSelectFolder={(folderId) => {
                setSelectedFolderId(folderId);
                setPage(1);
              }}
            />
          )}

          {selectedFolderId && (
          <>
            {/* Toolbar: kết quả + view toggle */}
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <span className={styles.resultCount}>
                  <strong>{filtered.length}</strong> tài liệu
                  {hasFilter && <span className={styles.resultFiltered}> (đang lọc)</span>}
                </span>
              </div>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Xem dạng danh sách"
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                  </svg>
                </button>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Xem dạng lưới"
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilter && (
              <div className={styles.chips}>
                {activeType !== 'Tất cả' && (
                  <Chip label={activeType} onRemove={() => handleFilter(setActiveType)('Tất cả')} />
                )}
                {activeFormat !== 'Tất cả' && (
                  <Chip label={activeFormat} onRemove={() => handleFilter(setActiveFormat)('Tất cả')} />
                )}
                {activeSource !== 'Tất cả' && (
                  <Chip label={activeSource} onRemove={() => handleFilter(setActiveSource)('Tất cả')} />
                )}
                {activeSubject !== 'Tất cả' && (
                  <Chip label={activeSubject} onRemove={() => handleFilter(setActiveSubject)('Tất cả')} />
                )}
              </div>
            )}

            {/* Card list / grid */}
            {paginated.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🔍</div>
                <p className={styles.emptyTitle}>Không tìm thấy tài liệu phù hợp</p>
                <p className={styles.emptySub}>Thử thay đổi từ khóa hoặc bỏ bớt bộ lọc</p>
                <button className={styles.emptyReset} onClick={resetFilters}>Xóa bộ lọc</button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? styles.gridList : styles.cardList}>
                {paginated.map((r) => (
                  <ResourceCard
                    key={r.id}
                    resource={r}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹ Trước
                </button>

                <div className={styles.pageDots}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`${styles.pageDot} ${p === page ? styles.pageDotActive : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sau ›
                </button>
              </div>)}
            </>
          )}
          
          
        </main>
      </div>

      {/* ══ MODALS ══ */}
      <ResourceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitForm}
        loading={formLoading}
        isAdmin={false}
      />
    </div>
  );
}

/* ── Sub-components ── */
function resolveUserFolderId(resource) {
  const text = `${resource.major || ''} ${resource.subject || ''} ${resource.title || ''}`.toLowerCase();
  const directMatch = RESOURCE_LEAF_FOLDERS.find((folder) => text.includes(folder.label.toLowerCase()));
  if (directMatch) return directMatch.id;

  const rules = [
    ['pháp luật', 'phap-luat-dai-cuong'],
    ['triết học', 'triet-hoc-mac-lenin'],
    ['giải tích', 'giai-tich'],
    ['đại số', 'dai-so-tuyen-tinh'],
    ['xác suất', 'xac-suat-thong-ke'],
    ['lập trình hướng đối tượng', 'cong-nghe-phan-mem'],
    ['công nghệ phần mềm', 'cong-nghe-phan-mem'],
    ['cơ sở dữ liệu', 'he-thong-thong-tin'],
    ['hệ thống thông tin', 'he-thong-thong-tin'],
    ['trí tuệ nhân tạo', 'khoa-hoc-may-tinh'],
    ['hệ điều hành', 'khoa-hoc-may-tinh'],
    ['khoa học máy tính', 'khoa-hoc-may-tinh'],
    ['kiến trúc máy tính', 'ky-thuat-may-tinh'],
    ['kỹ thuật máy tính', 'ky-thuat-may-tinh'],
    ['mạng máy tính', 'mang-may-tinh'],
    ['an toàn thông tin', 'an-toan-thong-tin'],
    ['thương mại điện tử', 'thuong-mai-dien-tu'],
    ['web', 'cong-nghe-phan-mem'],
    ['ui/ux', 'thuong-mai-dien-tu'],
  ];

  return rules.find(([keyword]) => text.includes(keyword))?.[1] || 'nhap-mon-lap-trinh';
}

function StatPill({ icon, value, label }) {
  return (
    <div className={styles.statPill}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className={styles.filterSection}>
      <p className={styles.filterTitle}>{title}</p>
      <div className={styles.filterOptions}>{children}</div>
    </div>
  );
}

function FilterOption({ label, count, active, onClick, small = false }) {
  return (
    <button
      className={`${styles.filterOpt} ${active ? styles.filterOptActive : ''} ${small ? styles.filterOptSmall : ''}`}
      onClick={onClick}
    >
      <span className={styles.filterOptLabel}>{label}</span>
      <span className={styles.filterOptCount}>{count}</span>
    </button>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className={styles.chip}>
      {label}
      <button className={styles.chipRemove} onClick={onRemove}>✕</button>
    </span>
  );
}
