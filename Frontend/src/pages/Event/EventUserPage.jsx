import { useState, useMemo } from 'react';
import EventCard from '../../components/sections/Event/EventCard';
import styles from './EventUserPage.module.css';

// ── Mock data ────────────────────────────────────────────────
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Hội thảo Nghiên cứu Khoa học 2024',
    location: 'Hội trường A, Tầng 2',
    date: '2024-10-24',
    time: '08:00',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'ACAD',
    description: 'Sự kiện thường niên quy tụ hơn 200 sinh viên tham gia nghiên cứu khoa học.',
    capacity: 200,
  },
  {
    id: 2,
    title: 'Workshop Kỹ năng mềm: Thuyết trình',
    location: 'Phòng B204',
    date: '2024-11-02',
    time: '13:30',
    estimatedCost: 50000,
    status: 'upcoming',
    tag: 'TECH',
    description: 'Workshop chuyên sâu về kỹ năng thuyết trình và làm việc nhóm.',
    capacity: 50,
  },
  {
    id: 3,
    title: 'Tọa đàm với Chuyên gia Công nghệ',
    location: 'Hội trường lớn',
    date: '2024-11-15',
    time: '09:00',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'TECH',
    description: 'Giao lưu cùng các chuyên gia đầu ngành công nghệ tại Việt Nam.',
    capacity: 300,
  },
  {
    id: 4,
    title: 'Chứng chỉ Phân tích Dữ liệu',
    location: 'Phòng máy tính C101',
    date: '2024-10-14',
    time: '08:00',
    estimatedCost: 200000,
    status: 'completed',
    tag: 'CERT',
    description: 'Khoá học 3 ngày về phân tích dữ liệu với Python.',
    capacity: 30,
  },
  {
    id: 5,
    title: 'Giao lưu văn nghệ cuối năm',
    location: 'Sân trường',
    date: '2024-12-20',
    time: '18:00',
    estimatedCost: 100000,
    status: 'upcoming',
    tag: 'SOCIAL',
    description: 'Chương trình văn nghệ và giao lưu kết thúc năm học.',
    capacity: 500,
  },
  {
    id: 6,
    title: 'Seminar Trí tuệ Nhân tạo',
    location: 'Phòng hội thảo D301',
    date: '2024-12-12',
    time: '14:00',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'ACAD',
    description: 'Seminar về các xu hướng mới nhất trong lĩnh vực AI.',
    capacity: 100,
  },
  {
    id: 7,
    title: 'Workshop Git & GitHub',
    location: 'Lab B202',
    date: '2024-11-07',
    time: '14:00',
    estimatedCost: 20000,
    status: 'upcoming',
    tag: 'TECH',
    description: 'Hướng dẫn quản lý source code và teamwork với GitHub.',
    capacity: 60,
  },
  {
    id: 8,
    title: 'Ngày hội Việc làm CNTT',
    location: 'Sảnh chính',
    date: '2024-11-10',
    time: '09:00',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'SOCIAL',
    description: 'Kết nối sinh viên với doanh nghiệp công nghệ.',
    capacity: 400,
  },
  {
    id: 9,
    title: 'Khóa học TOEIC Cấp tốc',
    location: 'Phòng B105',
    date: '2024-11-18',
    time: '18:00',
    estimatedCost: 150000,
    status: 'upcoming',
    tag: 'CERT',
    description: 'Luyện thi TOEIC dành cho sinh viên năm cuối.',
    capacity: 80,
  },
  {
    id: 10,
    title: 'Talkshow Startup Công nghệ',
    location: 'Hội trường C',
    date: '2024-11-22',
    time: '09:30',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'TECH',
    description: 'Gặp gỡ founder startup chia sẻ kinh nghiệm.',
    capacity: 180,
  },
  {
    id: 11,
    title: 'Workshop Thiết kế UI/UX',
    location: 'Phòng D204',
    date: '2024-11-25',
    time: '13:00',
    estimatedCost: 50000,
    status: 'upcoming',
    tag: 'TECH',
    description: 'Thực hành thiết kế giao diện người dùng hiện đại.',
    capacity: 45,
  },
  {
    id: 12,
    title: 'Seminar An ninh mạng',
    location: 'Phòng A303',
    date: '2024-11-28',
    time: '08:30',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'ACAD',
    description: 'Cập nhật xu hướng bảo mật và phòng chống tấn công mạng.',
    capacity: 120,
  },
  {
    id: 13,
    title: 'Cuộc thi Hackathon 24h',
    location: 'Innovation Lab',
    date: '2024-12-01',
    time: '08:00',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'TECH',
    description: 'Cuộc thi sáng tạo giải pháp công nghệ trong 24 giờ.',
    capacity: 100,
  },
  {
    id: 14,
    title: 'Workshop CV & Phỏng vấn',
    location: 'Phòng C103',
    date: '2024-12-04',
    time: '14:00',
    estimatedCost: 30000,
    status: 'upcoming',
    tag: 'SOCIAL',
    description: 'Chuẩn bị CV và kỹ năng phỏng vấn hiệu quả.',
    capacity: 70,
  },
  {
    id: 15,
    title: 'Khóa học MOS Word',
    location: 'Phòng máy A101',
    date: '2024-12-06',
    time: '08:00',
    estimatedCost: 100000,
    status: 'upcoming',
    tag: 'CERT',
    description: 'Ôn luyện chứng chỉ MOS Word cơ bản.',
    capacity: 35,
  },
  {
    id: 16,
    title: 'Diễn đàn Chuyển đổi số',
    location: 'Hội trường lớn',
    date: '2024-12-09',
    time: '09:00',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'ACAD',
    description: 'Diễn đàn trao đổi về xu hướng chuyển đổi số.',
    capacity: 250,
  },
  {
    id: 17,
    title: 'Giải bóng đá sinh viên',
    location: 'Sân vận động',
    date: '2024-12-14',
    time: '07:00',
    estimatedCost: 50000,
    status: 'upcoming',
    tag: 'SOCIAL',
    description: 'Giải đấu giao lưu thể thao giữa các khoa.',
    capacity: 220,
  },
  {
    id: 18,
    title: 'Workshop Python nâng cao',
    location: 'Lab C201',
    date: '2024-12-16',
    time: '13:30',
    estimatedCost: 70000,
    status: 'upcoming',
    tag: 'TECH',
    description: 'Thực hành Python nâng cao cho data analysis.',
    capacity: 55,
  },
  {
    id: 19,
    title: 'Seminar Điện toán đám mây',
    location: 'Phòng D105',
    date: '2024-12-18',
    time: '10:00',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'ACAD',
    description: 'Tìm hiểu Cloud Computing và cơ hội nghề nghiệp.',
    capacity: 130,
  },
  {
    id: 20,
    title: 'Lễ tổng kết cuối năm',
    location: 'Hội trường A',
    date: '2024-12-28',
    time: '17:30',
    estimatedCost: 0,
    status: 'upcoming',
    tag: 'SOCIAL',
    description: 'Tổng kết hoạt động và trao thưởng cuối năm.',
    capacity: 500,
  },
];

const TAGS = ['Tất cả', 'ACAD', 'TECH', 'CERT', 'SOCIAL'];

const HIGHLIGHTS = [
  { id: 'h1',  date: '2024-10-18', title: 'Guest Lecture: Tương lai Chuyển đổi Số', sub: 'TS. Nguyễn Văn A | Hội trường B | 18:00 – 20:00' },
  { id: 'h2',  date: '2024-10-21', title: 'Lab Chứng chỉ: Chuẩn Metadata Quốc gia', sub: 'Phòng kỹ thuật 4 | 09:00 – 17:00' },
  { id: 'h3',  date: '2024-11-05', title: 'Symposium: Khoa học Liên ngành', sub: 'Hội trường lớn & Trực tuyến | 10:00 – 16:00' },
  { id: 'h4',  date: '2024-11-09', title: 'Workshop AI Prompting', sub: 'D201 | 14:00 – 17:00' },
  { id: 'h5',  date: '2024-11-12', title: 'Talkshow Career Roadmap IT', sub: 'Hội trường A | 18:30 – 20:30' },
  { id: 'h6',  date: '2024-11-17', title: 'Mini Hackathon Night', sub: 'Innovation Lab | 19:00 – 23:00' },
  { id: 'h7',  date: '2024-11-23', title: 'Networking Day', sub: 'Sảnh chính | 09:00 – 12:00' },
  { id: 'h8',  date: '2024-11-28', title: 'Workshop Data Analyst', sub: 'B105 | 13:30 – 16:30' },
  { id: 'h9',  date: '2024-12-03', title: 'Seminar Cloud Computing', sub: 'D302 | 09:00 – 11:30' },
  { id: 'h10', date: '2024-12-06', title: 'Open Mic Night', sub: 'Sân trường | 19:00 – 21:00' },
  { id: 'h11', date: '2024-12-08', title: 'Workshop Resume Builder', sub: 'C201 | 14:00 – 17:00' },
  { id: 'h12', date: '2024-12-11', title: 'Research Poster Day', sub: 'Hall B | 08:00 – 12:00' },
  { id: 'h13', date: '2024-12-13', title: 'Talkshow Product Manager', sub: 'A203 | 18:00 – 20:00' },
  { id: 'h14', date: '2024-12-15', title: 'Cybersecurity Bootcamp', sub: 'Lab C | 08:30 – 16:00' },
  { id: 'h15', date: '2024-12-17', title: 'Game Dev Sharing', sub: 'B302 | 15:00 – 17:00' },
  { id: 'h16', date: '2024-12-19', title: 'IELTS Strategy Night', sub: 'B303 | 18:00 – 20:00' },
  { id: 'h17', date: '2024-12-21', title: 'Music Festival Student', sub: 'Main Yard | 18:30 – 22:00' },
  { id: 'h18', date: '2024-12-23', title: 'Community Volunteering', sub: 'Xuất phát 07:00 | Cổng trường' },
  { id: 'h19', date: '2024-12-26', title: 'Award Ceremony CLB', sub: 'Hall A | 17:00 – 19:00' },
  { id: 'h20', date: '2024-12-30', title: 'Countdown Year End Meetup', sub: 'Sân trường | 20:00 – 23:30' },
  
];

export default function EventUserPage() {
  const [activeTag, setActiveTag] = useState('Tất cả');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null); 
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      const matchTag    = activeTag === 'Tất cả' || e.tag === activeTag;
      const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [activeTag, search]);

  // Phân tách upcoming & completed
  const upcoming  = filtered.filter((e) => e.status === 'upcoming');
  const completed = filtered.filter((e) => e.status === 'completed');

  // Đăng ký sự kiện
  const handleRegister = (event) => {
    const existed = registeredEvents.some((item) => item.id === event.id);

    if (existed) return;

    setRegisteredEvents((prev) => [...prev, event]);
    alert(`Đăng ký thành công: ${event.title}`);
    setSelected(null);
  };

  // Hủy đăng ký
  const handleUnregister = (eventId) => {
    setRegisteredEvents((prev) =>
      prev.filter((item) => item.id !== eventId)
    );

    if (selected?.id === eventId) {
      setSelected(null);
    }
  };

  const isRegistered = (id) =>
    registeredEvents.some((item) => item.id === id);

  return (
    <div className={styles.page}>

      {/* ── Hero banner ── */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Khám phá <span className={styles.heroAccent}>Sự kiện</span>
          </h1>
          <p className={styles.heroSub}>
            Chuỗi workshop và seminar học thuật giúp bạn nâng cao kiến thức
            và kết nối cộng đồng.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.heroBtnPrimary}>Xem tất cả</button>
            <button className={styles.heroBtnSecondary}>Tải lịch</button>
          </div>
        </div>
      </div>

      {/* ── Search + Tags ── */}
      <div className={styles.filterRow}>
        <div className={styles.searchWrap}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Tìm sự kiện..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.tags}>
          {TAGS.map((tag) => (
            <button
              key={tag}
              className={`${styles.tag} ${activeTag === tag ? styles.tagActive : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {/* ── Đã đăng ký ── */}
      {registeredEvents.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hoạt động đã đăng ký</h2>
          </div>

          <div className={styles.highlightList}>
            {registeredEvents.map((event) => {
              const d = new Date(event.date);
              const month = d
                .toLocaleString('vi-VN', { month: 'short' })
                .toUpperCase();

              const day = d.getDate();

              return (
                <div
                  key={event.id}
                  className={styles.highlightItem}
                  onClick={() => setSelected(event)}
                >
                  <div className={styles.hlBadge}>
                    <span className={styles.hlMonth}>{month}</span>
                    <span className={styles.hlDay}>{day}</span>
                  </div>

                  <div className={styles.hlContent}>
                    <p className={styles.hlTitle}>{event.title}</p>
                    <p className={styles.hlSub}>
                      {event.location} | {event.time}
                    </p>
                  </div>

                  <button
                    className={styles.hlBookmark}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleUnregister(event.id);
                    }}
                  >
                    Đã đăng ký
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Sắp diễn ra ── */}
      {upcoming.length > 0 && (
        <section className={styles.sectionfut}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sắp diễn ra</h2>
          </div>

          <div className={styles.cardList}>
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelected(event)}
                onRegister={() => handleRegister(event)}
                onUnregister={() => handleUnregister(event.id)}
                disabled={isRegistered(event.id)}
                isAdmin={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Highlights ── */}
      <section className={styles.sectionspecial}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Hoạt động nổi bật</h2>
        </div>
        <div className={styles.highlightList}>
          {HIGHLIGHTS.map((h) => {
            const d     = new Date(h.date);
            const month = d.toLocaleString('vi-VN', { month: 'short' }).toUpperCase();
            const day   = d.getDate();
            return (
              <div key={h.id} className={styles.highlightItem}>
                <div className={styles.hlBadge}>
                  <span className={styles.hlMonth}>{month}</span>
                  <span className={styles.hlDay}>{day}</span>
                </div>
                <div className={styles.hlContent}>
                  <p className={styles.hlTitle}>{h.title}</p>
                  <p className={styles.hlSub}>{h.sub}</p>
                </div>
                <button className={styles.hlBookmark}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Đã kết thúc ── */}
      {completed.length > 0 && (
        <section className={styles.sectionend}>
          <h2 className={styles.sectionTitle}>Đã kết thúc</h2>

          <div className={styles.cardList}>
            {completed.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelected(event)}
                hideRegister
                isAdmin={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Modal chi tiết ── */}
      {selected && (
        <div
          className={styles.overlay}
          onClick={() => setSelected(null)}
        >
          <div
            className={styles.detailBox}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <div className={styles.detailDate}>
              {new Date(selected.date).toLocaleDateString(
                'vi-VN',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )}
              {selected.time && ` | ${selected.time}`}
            </div>

            <h2 className={styles.detailTitle}>
              {selected.title}
            </h2>

            <p className={styles.detailLocation}>
              📍 {selected.location}
            </p>

            <p className={styles.detailDesc}>
              {selected.description}
            </p>

            <div className={styles.detailMeta}>
              <span>
                👥 Sức chứa: {selected.capacity} người
              </span>

              {selected.estimatedCost > 0 && (
                <span>
                  💰{' '}
                  {Number(
                    selected.estimatedCost
                  ).toLocaleString('vi-VN')}
                  ₫
                </span>
              )}
            </div>

            {selected.status !== 'completed' && (
              <button
                className={styles.registerFullBtn}
                onClick={() =>
                  isRegistered(selected.id)
                    ? handleUnregister(selected.id)
                    : handleRegister(selected)
                }
              >
                {isRegistered(selected.id)
                  ? 'Hủy đăng ký'
                  : 'Đăng ký tham gia →'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}