import { useState, useMemo } from 'react';
import EventCard from '../../components/sections/Event/EventCard';
import styles from './EventUserPage.module.css';
import { HIGHLIGHTS, HL_PAGE_SIZE, MOCK_EVENTS, PAGE_SIZE, TAGS } from '../../data/Event/eventUserData';

function PaginationControls({ current, total, pageSize = PAGE_SIZE, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <button disabled={current === 1} onClick={() => onPageChange(current - 1)}>‹</button>
      <span>Trang {current} / {totalPages}</span>
      <button disabled={current === totalPages} onClick={() => onPageChange(current + 1)}>›</button>
    </div>
  );
}

export default function EventUserPage() {
  const [activeTag, setActiveTag] = useState('Tất cả');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);
  // Lưu set các id đã đăng ký
  const [registeredIds, setRegisteredIds] = useState(new Set());

  const [regPage, setRegPage] = useState(1);
  const [upPage, setUpPage]   = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [hlPage, setHlPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      const matchTag    = activeTag === 'Tất cả' || e.tag === activeTag;
      const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [activeTag, search]);

  const upcoming  = filtered.filter((e) => e.status === 'upcoming');
  const completed = filtered.filter((e) => e.status === 'completed');
  const registeredEvents = MOCK_EVENTS.filter((e) => registeredIds.has(e.id));

  // Hàm cắt dữ liệu theo trang
  const paginate = (data, currentPage) => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  };


  const isRegistered = (id) => registeredIds.has(id);

  const handleRegister = (event) => {
    setRegisteredIds((prev) => new Set([...prev, event.id]));
    setSelected(null);
  };

  const handleUnregister = (eventId) => {
    setRegisteredIds((prev) => {
      const next = new Set(prev);
      next.delete(eventId);
      return next;
    });
    // Nếu đang mở modal của event này thì đóng lại
    if (selected?.id === eventId) setSelected(null);
  };

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
            <button className={styles.heroBtnPrimary}>Thêm sự kiện đã đăng ký vào lịch</button>
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

      {/* ── Section: Hoạt động đã đăng ký ── */}
      {registeredEvents.length > 0 && (
        <div className={styles.sectionSmall}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hoạt động đã đăng ký ({registeredEvents.length})</h2>
          </div>
          <div className={styles.highlightList}>
            {paginate(registeredEvents, regPage).map((event) => (
              <div key={event.id} className={styles.highlightItemSmall} onClick={() => setSelected(event)}>
                <div className={styles.hlContent}>
                  <p className={styles.hlTitle}>{event.title}</p>
                </div>
                <button className={styles.hlUnregisterBtn} onClick={(e) => { e.stopPropagation(); handleUnregister(event.id); }}>
                  Hủy
                </button>
              </div>
            ))}
          </div>
          <PaginationControls current={regPage} total={registeredEvents.length} onPageChange={setRegPage} />
        </div>
      )}

      {/* ── Section: Sắp diễn ra ── */}
      <div className={styles.upcomingsection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sắp diễn ra</h2>
        </div>
        <div className={styles.cardList}>
          {paginate(upcoming, upPage).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => setSelected(event)}
              onRegister={() => handleRegister(event)}
              isRegistered={registeredIds.has(event.id)}
            />
          ))}
        </div>
        <PaginationControls current={upPage} total={upcoming.length} onPageChange={setUpPage} />
      </div>

      {/* ── Highlights ── */}
      <div className={styles.sectionspecial}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Hoạt động nổi bật</h2>
        </div>
        <div className={styles.highlightList}>
          {paginate(HIGHLIGHTS, hlPage, HL_PAGE_SIZE).map((h) => {
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
        <PaginationControls 
            current={hlPage} 
            total={HIGHLIGHTS.length} 
            pageSize={HL_PAGE_SIZE} 
            onPageChange={setHlPage} 
        />
      </div>

      {/* ── Section: Đã kết thúc ── */}
      {completed.length > 0 && (
        <div className={styles.sectionEnd}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Đã kết thúc</h2>
          </div>
          <div className={styles.cardList}>
            {paginate(completed, endPage).map((event) => (
              <EventCard key={event.id} event={event} hideRegister isAdmin={false} />
            ))}
          </div>
          <PaginationControls current={endPage} total={completed.length} onPageChange={setEndPage} />
        </div>
      )}

      {/* ── Modal chi tiết ── */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.detailBox} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>

            <div className={styles.detailDate}>
              {new Date(selected.date).toLocaleDateString('vi-VN', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
              {selected.time && ` | ${selected.time}`}
            </div>

            <h2 className={styles.detailTitle}>{selected.title}</h2>
            <p className={styles.detailLocation}>📍 {selected.location}</p>
            <p className={styles.detailDesc}>{selected.description}</p>

            <div className={styles.detailMeta}>
              <span>👥 Sức chứa: {selected.capacity} người</span>
              {selected.estimatedCost > 0 && (
                <span>💰 {Number(selected.estimatedCost).toLocaleString('vi-VN')}₫</span>
              )}
            </div>

            {/* Nút chỉ hiện khi chưa kết thúc */}
            {selected.status !== 'completed' && (
              <button
                className={styles.registerFullBtn}
                onClick={() =>
                  isRegistered(selected.id)
                    ? handleUnregister(selected.id)
                    : handleRegister(selected)
                }
              >
                {isRegistered(selected.id) ? 'Hủy đăng ký' : 'Đăng ký tham gia →'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
