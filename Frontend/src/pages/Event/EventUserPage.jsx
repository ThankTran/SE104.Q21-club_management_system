import { useEffect, useMemo, useState } from 'react';

import EventCard from '../../components/sections/Event/EventCard';
import {
  getEventRegistrationsByMemberAPI,
  getEventsAPI,
  normalizeEventFromApi,
  registerEventAPI,
  unregisterEventAPI,
} from '../../services/event-service';
import useAuthStore from '../../store/auth-store';
import styles from './EventUserPage.module.css';

const PAGE_SIZE = 5;
const HL_PAGE_SIZE = 4;
const ALL_TAG = 'ALL';
const TAGS = [
  { value: ALL_TAG, label: 'Tất cả' },
  { value: 'ACAD', label: 'ACAD' },
  { value: 'TECH', label: 'TECH' },
  { value: 'CERT', label: 'CERT' },
  { value: 'SOCIAL', label: 'SOCIAL' },
  { value: 'OTHER', label: 'OTHER' },
];

const pad2 = (value) => String(value).padStart(2, '0');

const parseLocalDateTime = (date, time = '00:00') => {
  if (!date) return null;
  const [year, month, day] = String(date).split('-').map(Number);
  const [hour = 0, minute = 0] = String(time || '00:00').split(':').map(Number);
  if (![year, month, day].every(Number.isFinite)) return null;
  return new Date(year, month - 1, day, hour, minute, 0);
};

const formatIcsDate = (date) =>
  `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`;

const formatIcsDateTime = (date) =>
  `${formatIcsDate(date)}T${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}`;

const formatIcsTimestamp = (date = new Date()) =>
  `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`;

const escapeIcsText = (value = '') =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');

const buildRegisteredEventsIcs = (registeredEvents) => {
  const dtstamp = formatIcsTimestamp();
  const items = registeredEvents
    .map((event) => {
      const start = parseLocalDateTime(event.date, event.time);
      if (!start) return null;

      const lines = [
        'BEGIN:VEVENT',
        `UID:${escapeIcsText(event.id || event.title)}@thmn-academic-club`,
        `DTSTAMP:${dtstamp}`,
        `SUMMARY:${escapeIcsText(event.title || 'Sự kiện câu lạc bộ')}`,
      ];

      if (event.time) {
        const end = event.endTime
          ? parseLocalDateTime(event.date, event.endTime)
          : new Date(start.getTime() + 60 * 60 * 1000);
        const safeEnd = end && end > start ? end : new Date(start.getTime() + 60 * 60 * 1000);
        lines.push(`DTSTART:${formatIcsDateTime(start)}`);
        lines.push(`DTEND:${formatIcsDateTime(safeEnd)}`);
      } else {
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        lines.push(`DTSTART;VALUE=DATE:${formatIcsDate(start)}`);
        lines.push(`DTEND;VALUE=DATE:${formatIcsDate(end)}`);
      }

      if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);
      if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
      lines.push('END:VEVENT');
      return lines.join('\r\n');
    })
    .filter(Boolean);

  if (!items.length) return '';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//THMN Academic Club//Registered Events//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...items,
    'END:VCALENDAR',
  ].join('\r\n');
};

function PaginationControls({ current, total, pageSize = PAGE_SIZE, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <button disabled={current === 1} onClick={() => onPageChange(current - 1)}>{'<'}</button>
      <span>Trang {current} / {totalPages}</span>
      <button disabled={current === totalPages} onClick={() => onPageChange(current + 1)}>{'>'}</button>
    </div>
  );
}

export default function EventUserPage() {
  const currentUser = useAuthStore((state) => state.user);
  const memberId = currentUser?.memberId;

  const [events, setEvents] = useState([]);
  const [activeTag, setActiveTag] = useState(ALL_TAG);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const [regPage, setRegPage] = useState(1);
  const [upPage, setUpPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [hlPage, setHlPage] = useState(1);

  useEffect(() => {
    let ignore = false;

    const requests = [getEventsAPI()];
    if (memberId) {
      requests.push(getEventRegistrationsByMemberAPI(memberId));
    }

    Promise.all(requests)
      .then(([eventData, registrationData = []]) => {
        if (ignore) return;
        setEvents(Array.isArray(eventData) ? eventData.map(normalizeEventFromApi) : []);
        setRegisteredIds(new Set(
          Array.isArray(registrationData) ? registrationData.map((item) => item.eventId) : [],
        ));
        setApiError('');
        setApiSuccess('');
      })
      .catch((error) => {
        if (ignore) return;
        setEvents([]);
        setRegisteredIds(new Set());
        setApiSuccess('');
        setApiError(error?.message || 'Không tải được danh sách sự kiện.');
      });

    return () => {
      ignore = true;
    };
  }, [memberId]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return events.filter((event) => {
      const matchTag = activeTag === ALL_TAG || event.tag === activeTag;
      const matchSearch = !query || event.title.toLowerCase().includes(query);
      return matchTag && matchSearch;
    });
  }, [activeTag, events, search]);

  const upcoming = filtered.filter((event) => ['upcoming', 'published'].includes(event.status));
  const completed = filtered.filter((event) => event.status === 'completed');
  const registeredEvents = events.filter((event) => registeredIds.has(event.id));
  const highlights = upcoming.slice(0, 12);

  const paginate = (data, currentPage, pageSize = PAGE_SIZE) => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  };

  const isRegistered = (id) => registeredIds.has(id);

  const handleDownloadCalendar = () => {
    const icsContent = buildRegisteredEventsIcs(registeredEvents);
    if (!icsContent) {
      setApiSuccess('');
      setApiError('Không có sự kiện đã đăng ký hợp lệ để thêm vào lịch.');
      return;
    }

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'su-kien-da-dang-ky.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setApiError('');
    setApiSuccess('Đã tải file lịch cho các sự kiện đã đăng ký.');
  };

  const handleRegister = async (event) => {
    if (!memberId) {
      setApiError('Không xác định được thành viên đang đăng nhập.');
      return;
    }
    try {
      await registerEventAPI(event.id, memberId);
      setRegisteredIds((prev) => new Set([...prev, event.id]));
      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id ? { ...item, attendance: Number(item.attendance || 0) + 1 } : item,
        ),
      );
      setSelected(null);
      setApiError('');
      setApiSuccess('Đăng ký sự kiện thành công. Khoản phí nếu có đã được thêm vào mục Đóng quỹ.');
    } catch (error) {
      setApiSuccess('');
      setApiError(error?.message || 'Không đăng ký được sự kiện.');
    }
  };

  const handleUnregister = async (eventId) => {
    if (!memberId) {
      setApiError('Không xác định được thành viên đang đăng nhập.');
      return;
    }
    try {
      await unregisterEventAPI(eventId, memberId);
      setRegisteredIds((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
      setEvents((prev) =>
        prev.map((item) =>
          item.id === eventId
            ? { ...item, attendance: Math.max(0, Number(item.attendance || 0) - 1) }
            : item,
        ),
      );
      if (selected?.id === eventId) setSelected(null);
      setApiError('');
      setApiSuccess('Đã hủy đăng ký sự kiện.');
    } catch (error) {
      setApiSuccess('');
      setApiError(error?.message || 'Không hủy đăng ký được sự kiện.');
    }
  };

  return (
    <div className={styles.page}>
      {apiError && <div className={styles.apiError}>{apiError}</div>}
      {apiSuccess && <div className={styles.apiSuccess}>{apiSuccess}</div>}

      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Khám phá <span className={styles.heroAccent}>Sự kiện</span>
          </h1>
          <p className={styles.heroSub}>
            Các workshop và seminar của câu lạc bộ được tải trực tiếp từ hệ thống.
          </p>
          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.heroBtnPrimary}
              onClick={handleDownloadCalendar}
              disabled={registeredEvents.length === 0}
            >
              Thêm vào lịch
            </button>
          </div>
        </div>
      </div>

      <div className={styles.sectionSmall}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Các sự kiện đã đăng ký ({registeredEvents.length})</h2>
        </div>
        {registeredEvents.length > 0 ? (
          <>
            <div className={styles.highlightList}>
              {paginate(registeredEvents, regPage).map((event) => (
                <div key={event.id} className={styles.highlightItemSmall} onClick={() => setSelected(event)}>
                  <div className={styles.hlContent}>
                    <p className={styles.hlTitle}>{event.title}</p>
                  </div>
                  <button
                    className={styles.hlUnregisterBtn}
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      handleUnregister(event.id);
                    }}
                  >
                    Hủy
                  </button>
                </div>
              ))}
            </div>
            <PaginationControls current={regPage} total={registeredEvents.length} onPageChange={setRegPage} />
          </>
        ) : (
          <div className={styles.emptyState}>Bạn chưa đăng ký sự kiện nào.</div>
        )}
      </div>

      <div className={styles.filterRow}>
        <div className={styles.searchWrap}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Tìm sự kiện..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className={styles.tags}>
          {TAGS.map((tag) => (
            <button
              key={tag.value}
              className={`${styles.tag} ${activeTag === tag.value ? styles.tagActive : ''}`}
              onClick={() => setActiveTag(tag.value)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

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
              onUnregister={() => handleUnregister(event.id)}
              isRegistered={isRegistered(event.id)}
            />
          ))}
        </div>
        <PaginationControls current={upPage} total={upcoming.length} onPageChange={setUpPage} />
      </div>

      {highlights.length > 0 && (
        <div className={styles.sectionspecial}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hoạt động nổi bật</h2>
          </div>
          <div className={styles.highlightList}>
            {paginate(highlights, hlPage, HL_PAGE_SIZE).map((event) => {
              const date = event.date ? new Date(event.date) : null;
              const month = date ? date.toLocaleString('vi-VN', { month: 'short' }).toUpperCase() : '--';
              const day = date ? date.getDate() : '--';
              return (
                <div key={event.id} className={styles.highlightItem} onClick={() => setSelected(event)}>
                  <div className={styles.hlBadge}>
                    <span className={styles.hlMonth}>{month}</span>
                    <span className={styles.hlDay}>{day}</span>
                  </div>
                  <div className={styles.hlContent}>
                    <p className={styles.hlTitle}>{event.title}</p>
                    <p className={styles.hlSub}>{event.location}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <PaginationControls
            current={hlPage}
            total={highlights.length}
            pageSize={HL_PAGE_SIZE}
            onPageChange={setHlPage}
          />
        </div>
      )}

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

      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.detailBox} onClick={(event) => event.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>×</button>

            <div className={styles.detailDate}>
              {new Date(selected.date).toLocaleDateString('vi-VN', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
              {selected.time && ` | ${selected.time}`}
            </div>

            <h2 className={styles.detailTitle}>{selected.title}</h2>
            <p className={styles.detailLocation}>{selected.location}</p>
            <p className={styles.detailDesc}>{selected.description}</p>

            <div className={styles.detailMeta}>
              <span>Sức chứa: {selected.capacity || 0} người</span>
              <span>Đã đăng ký: {selected.attendance || 0}</span>
              {selected.estimatedCost > 0 && (
                <span>{Number(selected.estimatedCost).toLocaleString('vi-VN')} VND</span>
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
                {isRegistered(selected.id) ? 'Hủy đăng ký' : 'Đăng ký tham gia'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
