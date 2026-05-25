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
const TAGS = ['Tat ca', 'ACAD', 'TECH', 'CERT', 'SOCIAL', 'OTHER'];

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
  const [activeTag, setActiveTag] = useState('Tat ca');
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
        setApiError(error?.message || 'Khong tai duoc danh sach su kien.');
      });

    return () => {
      ignore = true;
    };
  }, [memberId]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return events.filter((event) => {
      const matchTag = activeTag === 'Tat ca' || event.tag === activeTag;
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

  const handleRegister = async (event) => {
    if (!memberId) {
      setApiError('Khong xac dinh duoc thanh vien dang dang nhap.');
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
      setApiError(error?.message || 'Khong dang ky duoc su kien.');
    }
  };

  const handleUnregister = async (eventId) => {
    if (!memberId) {
      setApiError('Khong xac dinh duoc thanh vien dang dang nhap.');
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
      setApiError(error?.message || 'Khong huy dang ky duoc su kien.');
    }
  };

  return (
    <div className={styles.page}>
      {apiError && <div className={styles.apiError}>{apiError}</div>}
      {apiSuccess && <div className={styles.apiSuccess}>{apiSuccess}</div>}

      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Kham pha <span className={styles.heroAccent}>Su kien</span>
          </h1>
          <p className={styles.heroSub}>
            Cac workshop va seminar cua cau lac bo duoc tai truc tiep tu he thong.
          </p>
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.searchWrap}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Tim su kien..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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

      {registeredEvents.length > 0 && (
        <div className={styles.sectionSmall}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hoat dong da dang ky ({registeredEvents.length})</h2>
          </div>
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
                  Huy
                </button>
              </div>
            ))}
          </div>
          <PaginationControls current={regPage} total={registeredEvents.length} onPageChange={setRegPage} />
        </div>
      )}

      <div className={styles.upcomingsection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sap dien ra</h2>
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
            <h2 className={styles.sectionTitle}>Hoat dong noi bat</h2>
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
            <h2 className={styles.sectionTitle}>Da ket thuc</h2>
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
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>x</button>

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
              <span>Suc chua: {selected.capacity || 0} nguoi</span>
              <span>Da dang ky: {selected.attendance || 0}</span>
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
                {isRegistered(selected.id) ? 'Huy dang ky' : 'Dang ky tham gia'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
