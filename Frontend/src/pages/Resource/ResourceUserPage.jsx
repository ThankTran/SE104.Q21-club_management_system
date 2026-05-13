import { useState, useMemo } from 'react';

import ResourceCard from '../../components/sections/Resource/ResourceCard';
import ResourceFilter from '../../components/sections/Resource/ResourceFilter';
import ResourceForm from '../../components/sections/Resource/ResourceForm';
import ResourceDetailModal from '../../components/sections/Resource/ResourceDetailModal';
import ResourceFolderView from '../../components/sections/Resource/ResourceFolderView';

import styles from './ResourceUserPage.module.css';

// ── Mock data ─────────────────────────────────────────────────
// Chỉ hiển thị tài liệu đã duyệt (QĐ8.1), sắp xếp mới nhất trước (QĐ8.3)
const MOCK_RESOURCES = [
  {
    id: 1,
    title: 'Giáo trình Lập trình hướng đối tượng',
    category: 'major',
    major: 'Công nghệ phần mềm',
    subject: 'Lập trình hướng đối tượng',
    type: 'Giáo trình',
    format: 'PDF',
    source: 'Giảng viên cung cấp',
    description: 'Tài liệu chính thức môn OOP dùng trong học kỳ 1. Bao gồm lý thuyết và bài tập thực hành.',
    link: '#',
    uploadedBy: 'Nguyễn Minh Anh',
    createdAt: '2024-12-10',
    status: 'approved',
  },
  {
    id: 2,
    title: 'Slide Cơ sở dữ liệu – Chương 1 đến 5',
    category: 'major',
    major: 'Hệ thống thông tin',
    subject: 'Cơ sở dữ liệu',
    type: 'Slide bài giảng',
    format: 'PPT',
    source: 'Giảng viên cung cấp',
    description: 'Slide bài giảng từ chương 1 đến chương 5 môn CSDL, bao gồm ERD và SQL cơ bản.',
    link: '#',
    uploadedBy: 'Trần Quốc Bảo',
    createdAt: '2024-12-08',
    status: 'approved',
  },
  {
    id: 3,
    title: 'Tài liệu tham khảo Mạng máy tính',
    category: 'major',
    major: 'Mạng máy tính và truyền thông',
    subject: 'Mạng máy tính',
    type: 'Tài liệu tham khảo',
    format: 'PDF',
    source: 'Internet',
    description: 'Tổng hợp lý thuyết về mô hình OSI, TCP/IP và các giao thức mạng phổ biến.',
    link: '#',
    uploadedBy: 'Lê Hoàng Nam',
    createdAt: '2024-12-05',
    status: 'approved',
  },
  {
    id: 4,
    title: 'Giáo trình Giải tích 1',
    category: 'general',
    major: null,
    subject: 'Giải tích 1',
    type: 'Giáo trình',
    format: 'PDF',
    source: 'Giảng viên cung cấp',
    description: 'Giáo trình chính thức Giải tích 1, bao gồm chuỗi số, hàm nhiều biến và tích phân.',
    link: '#',
    uploadedBy: 'Phạm Gia Hân',
    createdAt: '2024-12-01',
    status: 'approved',
  },
  {
    id: 5,
    title: 'Slide Kỹ thuật phần mềm – Agile & Scrum',
    category: 'major',
    major: 'Công nghệ phần mềm',
    subject: 'Kỹ thuật phần mềm',
    type: 'Slide bài giảng',
    format: 'PPT',
    source: 'Tự biên soạn',
    description: 'Tổng hợp phương pháp Agile và Scrum trong phát triển phần mềm hiện đại.',
    link: '#',
    uploadedBy: 'Võ Đức Tài',
    createdAt: '2024-11-28',
    status: 'approved',
  },
  {
    id: 6,
    title: 'Python cho Data Science – Hướng dẫn',
    category: 'major',
    major: 'Khoa học dữ liệu',
    subject: 'Khoa học dữ liệu',
    type: 'Tài liệu tham khảo',
    format: 'PDF',
    source: 'Internet',
    description: 'Hướng dẫn thực hành Python với Pandas, NumPy và Matplotlib cho data analysis.',
    link: '#',
    uploadedBy: 'Nguyễn Khánh Linh',
    createdAt: '2024-11-25',
    status: 'approved',
  },
  {
    id: 7,
    title: 'Giáo trình Đại số tuyến tính',
    category: 'general',
    major: null,
    subject: 'Đại số tuyến tính',
    type: 'Giáo trình',
    format: 'PDF',
    source: 'Giảng viên cung cấp',
    description: 'Ma trận, định thức, không gian véctơ và các áp dụng trong kỹ thuật.',
    link: '#',
    uploadedBy: 'Đặng Nhật Quang',
    createdAt: '2024-11-22',
    status: 'approved',
  },
  {
    id: 8,
    title: 'Slide An toàn thông tin – Chương 1-4',
    category: 'major',
    major: 'An toàn thông tin',
    subject: 'An toàn thông tin',
    type: 'Slide bài giảng',
    format: 'PPT',
    source: 'Giảng viên cung cấp',
    description: 'Bảo mật hệ thống, mã hóa và các phương thức tấn công phổ biến.',
    link: '#',
    uploadedBy: 'Huỳnh Bảo Trân',
    createdAt: '2024-11-20',
    status: 'approved',
  },
  {
    id: 9,
    title: 'Tài liệu Git & GitHub thực hành',
    category: 'major',
    major: 'Công nghệ phần mềm',
    subject: 'Công cụ lập trình',
    type: 'Tài liệu tham khảo',
    format: 'PDF',
    source: 'Internet',
    description: 'Hướng dẫn sử dụng Git từ cơ bản đến nâng cao, bao gồm branching và merge.',
    link: '#',
    uploadedBy: 'Trương Hải Đăng',
    createdAt: '2024-11-18',
    status: 'approved',
  },
  {
    id: 10,
    title: 'Giáo trình Kiến trúc máy tính',
    category: 'major',
    major: 'Kỹ thuật máy tính',
    subject: 'Kiến trúc máy tính',
    type: 'Giáo trình',
    format: 'PDF',
    source: 'Giảng viên cung cấp',
    description: 'Tổ chức và kiến trúc máy tính, bộ nhớ, CPU và pipeline.',
    link: '#',
    uploadedBy: 'Bùi Ngọc Mai',
    createdAt: '2024-11-15',
    status: 'approved',
  },
  {
    id: 11,
    title: 'React.js – Tài liệu học cơ bản',
    category: 'major',
    major: 'Công nghệ phần mềm',
    subject: 'Lập trình Web',
    type: 'Tài liệu tham khảo',
    format: 'PDF',
    source: 'Internet',
    description: 'Tổng hợp kiến thức React.js: components, hooks, routing và state management.',
    link: '#',
    uploadedBy: 'Lý Tuấn Kiệt',
    createdAt: '2024-11-12',
    status: 'approved',
  },
  {
    id: 12,
    title: 'Slide Trí tuệ nhân tạo – Giới thiệu AI',
    category: 'major',
    major: 'Khoa học máy tính',
    subject: 'Trí tuệ nhân tạo',
    type: 'Slide bài giảng',
    format: 'PPT',
    source: 'Giảng viên cung cấp',
    description: 'Tổng quan AI, machine learning và deep learning. Bài giảng tuần 1-3.',
    link: '#',
    uploadedBy: 'Phan Thảo Vy',
    createdAt: '2024-11-10',
    status: 'approved',
  },
  {
    id: 13,
    title: 'Tổng hợp đề thi CSDL các năm',
    category: 'major',
    major: 'Hệ thống thông tin',
    subject: 'Cơ sở dữ liệu',
    type: 'Tài liệu tham khảo',
    format: 'DOCX',
    source: 'Tự biên soạn',
    description: 'Đề thi và đáp án môn CSDL từ năm 2020 đến 2024.',
    link: '#',
    uploadedBy: 'Ngô Gia Huy',
    createdAt: '2024-11-08',
    status: 'approved',
  },
  {
    id: 14,
    title: 'Docker & Container – Hướng dẫn thực tế',
    category: 'major',
    major: 'Công nghệ phần mềm',
    subject: 'DevOps',
    type: 'Tài liệu tham khảo',
    format: 'PDF',
    source: 'Internet',
    description: 'Hướng dẫn sử dụng Docker, Docker Compose và deploy ứng dụng thực tế.',
    link: '#',
    uploadedBy: 'Mai Thanh Tùng',
    createdAt: '2024-11-05',
    status: 'approved',
  },
  {
    id: 15,
    title: 'Slide Lập trình Web – HTML CSS JS',
    category: 'major',
    major: 'Thương mại điện tử',
    subject: 'Lập trình Web',
    type: 'Slide bài giảng',
    format: 'PPT',
    source: 'Giảng viên cung cấp',
    description: 'Slide từ tuần 1 đến tuần 8, bao gồm HTML5, CSS3, JavaScript ES6+.',
    link: '#',
    uploadedBy: 'Đoàn Yến Nhi',
    createdAt: '2024-11-02',
    status: 'approved',
  },
  {
    id: 16,
    title: 'Giáo trình Xác suất thống kê',
    category: 'general',
    major: null,
    subject: 'Xác suất thống kê',
    type: 'Giáo trình',
    format: 'PDF',
    source: 'Giảng viên cung cấp',
    description: 'Lý thuyết xác suất, phân phối chuẩn, kiểm định giả thuyết và hồi quy.',
    link: '#',
    uploadedBy: 'Tạ Minh Khoa',
    createdAt: '2024-10-28',
    status: 'approved',
  },
  {
    id: 17,
    title: 'Node.js – Backend Development Guide',
    category: 'major',
    major: 'Công nghệ phần mềm',
    subject: 'Lập trình Web',
    type: 'Tài liệu tham khảo',
    format: 'PDF',
    source: 'Internet',
    description: 'Xây dựng REST API với Node.js, Express và kết nối cơ sở dữ liệu.',
    link: '#',
    uploadedBy: 'Vũ Thành Công',
    createdAt: '2024-10-25',
    status: 'approved',
  },
  {
    id: 18,
    title: 'Tổng hợp đề thi Giải tích 1 – 2023',
    category: 'general',
    major: null,
    subject: 'Giải tích 1',
    type: 'Tài liệu tham khảo',
    format: 'DOCX',
    source: 'Tự biên soạn',
    description: 'Đề thi và lời giải chi tiết môn Giải tích 1 học kỳ 1 năm 2023.',
    link: '#',
    uploadedBy: 'Châu Bích Ngọc',
    createdAt: '2024-10-22',
    status: 'approved',
  },
  {
    id: 19,
    title: 'Slide Hệ điều hành – Chương 1-6',
    category: 'major',
    major: 'Khoa học máy tính',
    subject: 'Hệ điều hành',
    type: 'Slide bài giảng',
    format: 'PPT',
    source: 'Giảng viên cung cấp',
    description: 'Process, Thread, Memory management và File system trong hệ điều hành.',
    link: '#',
    uploadedBy: 'Nguyễn Quốc Hưng',
    createdAt: '2024-10-18',
    status: 'approved',
  },
  {
    id: 20,
    title: 'Tài liệu UI/UX Design Fundamentals',
    category: 'major',
    major: 'Thương mại điện tử',
    subject: 'Thiết kế giao diện',
    type: 'Tài liệu tham khảo',
    format: 'PDF',
    source: 'Internet',
    description: 'Nguyên tắc thiết kế UX, wireframing và prototyping với Figma.',
    link: '#',
    uploadedBy: 'Lâm Gia Linh',
    createdAt: '2024-10-15',
    status: 'approved', 
  },
];

const PAGE_SIZE = 20; // QĐ8.2: tối đa 20 tài liệu mỗi lần tra cứu

export default function ResourceUserPage() {
  const [search, setSearch]           = useState('');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [filterOpen, setFilterOpen]   = useState(false);

  const [page, setPage]               = useState(1);
  const [selected, setSelected]       = useState(null);

  // Modal đề xuất tài liệu
  const [formOpen, setFormOpen]       = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  // Selected category trong folder view 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedSubjectFolder, setSelectedSubjectFolder] = useState(null);

  // Danh sách môn học unique
  const subjects = useMemo(
    () => [...new Set(MOCK_RESOURCES.map((r) => r.subject))].sort(),
    []
  );

  // Filter + tìm kiếm (QĐ8.1: chỉ hiển thị đã duyệt; QĐ8.3: mới nhất trước)
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return MOCK_RESOURCES
      .filter((r) => r.status === 'approved') // QĐ8.1
      .filter((r) => {
        const matchSearch  = !q || r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q);
        const matchType    = typeFilter    === 'all' || r.type    === typeFilter;
        const matchFormat  = formatFilter  === 'all' || r.format  === formatFilter;
        const matchSubject = subjectFilter === 'all' || r.subject === subjectFilter;
        return matchSearch && matchType && matchFormat && matchSubject;
      })
      .filter((r) => {
        if (selectedCategory === "general") {
          return r.category === "general";
        }

        if (selectedCategory === "major" && selectedMajor) {
          return r.category === "major" && r.major === selectedMajor;
        }

        if (selectedSubjectFolder) {
          return r.subject === selectedSubjectFolder;
        }

        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // QĐ8.3
  }, [search, typeFilter, formatFilter, subjectFilter, selectedCategory, selectedMajor, selectedSubjectFolder]);

  // QĐ8.2: tối đa 20 tài liệu
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSubmitForm = (formData) => {
    setFormLoading(true);
    // Giả lập gửi API
    setTimeout(() => {
      setFormLoading(false);
      setFormOpen(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }, 800);
  };

  const hasFilter = typeFilter !== 'all' || formatFilter !== 'all' || subjectFilter !== 'all';

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            Kho tài liệu <span className={styles.heroAccent}>học thuật</span>
          </h1>
          <p className={styles.heroSub}>
            Tổng hợp giáo trình, slide bài giảng và tài liệu tham khảo được xét duyệt bởi ban học thuật. Tìm kiếm và tải về miễn phí.
          </p>
          <button className={styles.proposeBtn} onClick={() => setFormOpen(true)}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Đề xuất thêm tài liệu
          </button>
        </div>

        {/* Stats */}
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{MOCK_RESOURCES.length}</span>
            <span className={styles.statLabel}>Tài liệu</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{subjects.length}</span>
            <span className={styles.statLabel}>Môn học</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>3</span>
            <span className={styles.statLabel}>Định dạng</span>
          </div>
        </div>
      </div>

      {/* ── Toast thành công ── */}
      {submitted && (
        <div className={styles.toast}>
          ✅ Đề xuất đã được gửi! Admin sẽ xét duyệt sớm nhất có thể.
        </div>
      )}

      {/* ── Folder view ── */}
      {!selectedMajor && !selectedSubjectFolder && (
        <ResourceFolderView
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setSelectedMajor(null);
            setSelectedSubjectFolder(null);
            setPage(1);
          }}
          onSelectMajor={(major) => {
            setSelectedMajor(major);
            setPage(1);
          }}
          onSelectSubject={(subject) => {
            setSelectedSubjectFolder(subject);
            setPage(1);
          }}
        />
      )}

      {/* ── Search + Filter ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Tìm theo tên tài liệu hoặc môn học..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <ResourceFilter
          open={filterOpen}
          setOpen={setFilterOpen}
          typeFilter={typeFilter}
          setTypeFilter={(v) => { setTypeFilter(v); setPage(1); }}
          formatFilter={formatFilter}
          setFormatFilter={(v) => { setFormatFilter(v); setPage(1); }}
          subjectFilter={subjectFilter}
          setSubjectFilter={(v) => { setSubjectFilter(v); setPage(1); }}
          subjects={subjects}
        />

        <span className={styles.resultCount}>
          {filtered.length} tài liệu
          {filtered.length > PAGE_SIZE && ` (hiển thị ${PAGE_SIZE}/lần)`}
        </span>
      </div>

      {/* ── Active filter chips ── */}
      {hasFilter && (
        <div className={styles.filterChips}>
          {typeFilter !== 'all' && (
            <span className={styles.chip}>
              {typeFilter}
              <button onClick={() => setTypeFilter('all')}>✕</button>
            </span>
          )}
          {formatFilter !== 'all' && (
            <span className={styles.chip}>
              {formatFilter}
              <button onClick={() => setFormatFilter('all')}>✕</button>
            </span>
          )}
          {subjectFilter !== 'all' && (
            <span className={styles.chip}>
              {subjectFilter}
              <button onClick={() => setSubjectFilter('all')}>✕</button>
            </span>
          )}
          <button className={styles.clearAll} onClick={() => { setTypeFilter('all'); setFormatFilter('all'); setSubjectFilter('all'); }}>
            Xóa tất cả
          </button>
        </div>
      )}

      {/* ── Danh sách tài liệu (BM8) ── */}
      {paginated.length === 0 ? (
        <div className={styles.empty}>
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#cbd5e0" strokeWidth="1.2">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          <p>Không tìm thấy tài liệu phù hợp</p>
          <button className={styles.emptyReset} onClick={() => { setSearch(''); setTypeFilter('all'); setFormatFilter('all'); setSubjectFilter('all'); }}>
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className={styles.cardList}>
          {paginated.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              onClick={() => setSelected(r)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹ Trước</button>
          <span>Trang {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Sau ›</button>
        </div>
      )}

      {/* ── BM8 note ── */}
      <p className={styles.bm8Note}>
        📋 Kết quả tra cứu chỉ hiển thị tài liệu đã được duyệt, tối đa 20 tài liệu mỗi lần, sắp xếp mới nhất trước.
      </p>

      {/* ── Modals ── */}
      <ResourceDetailModal
        resource={selected}
        onClose={() => setSelected(null)}
        isAdmin={false}
      />

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