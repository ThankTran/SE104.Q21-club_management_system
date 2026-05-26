import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getEventsAPI,
  normalizeEventFromApi,
} from '../../../../services/event-service';
import { eventsData } from '../../../../data/Public/content';
import styles from './Event.module.css';

const INITIAL_VISIBLE = 3;
const ACTIVE_STATUSES = new Set(['upcoming', 'published']);

const formatEventDescription = (event) => {
  const parts = [];
  if (event.date) {
    parts.push(new Date(event.date).toLocaleDateString('vi-VN'));
  }
  if (event.location) {
    parts.push(event.location);
  }

  if (event.description) {
    return parts.length ? `${parts.join(' • ')} - ${event.description}` : event.description;
  }

  return parts.join(' • ') || 'Sự kiện đang được cập nhật thông tin chi tiết.';
};

export default function Events() {
  const { title, description, cta } = eventsData;
  const [inView, setInView] = useState(false);
  const [events, setEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ignore = false;

    getEventsAPI()
      .then((data) => {
        if (ignore) return;
        const nextEvents = Array.isArray(data)
          ? data
            .map(normalizeEventFromApi)
            .filter((event) => ACTIVE_STATUSES.has(event.status))
            .sort((a, b) => {
              const aTime = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
              const bTime = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
              return aTime - bTime;
            })
          : [];

        setEvents(nextEvents);
        setApiError('');
      })
      .catch((error) => {
        if (ignore) return;
        setEvents([]);
        setApiError(error?.message || 'Không tải được danh sách sự kiện.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const visibleEvents = useMemo(
    () => (showAll ? events : events.slice(0, INITIAL_VISIBLE)),
    [events, showAll]
  );

  const hasMore = events.length > INITIAL_VISIBLE;

  return (
    <section className={styles.events} id="events" ref={sectionRef}>
      <div className={styles.shape} />

      <div className={styles.inner}>
        <div className={`${styles.imgBox} ${inView ? styles.imgVisible : ''}`}>
          <div className={styles.pulseRing} />
          <div className={styles.pulseRing2} />

          <svg width="60" height="60" viewBox="0 0 60 60" fill="none"
            className={styles.calIcon}>
            <rect x="6" y="10" width="48" height="40" rx="4"
              stroke="var(--primary-500)" strokeWidth="2.5" />
            <path d="M6 22h48" stroke="var(--primary-500)" strokeWidth="2.5" />
            <path d="M20 6v8M40 6v8" stroke="var(--primary-500)"
              strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className={`${styles.content} ${inView ? styles.contentVisible : ''}`}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.desc}>{description}</p>

          {apiError && <p className={styles.stateText}>{apiError}</p>}
          {loading && <p className={styles.stateText}>Đang tải sự kiện...</p>}

          {!loading && !apiError && visibleEvents.length === 0 && (
            <p className={styles.stateText}>Chưa có sự kiện đang hoạt động hoặc sắp tới.</p>
          )}

          <ul className={styles.list}>
            {visibleEvents.map((event, i) => (
              <li
                key={event.id || `${event.title}-${i}`}
                className={`${styles.item} ${inView ? styles.itemVisible : ''}`}
                style={{ transitionDelay: `${0.3 + i * 0.12}s` }}
              >
                <span className={styles.dot} />
                <div>
                  <strong className={styles.itemTitle}>{event.title}</strong>
                  <p className={styles.itemDesc}>{formatEventDescription(event)}</p>
                </div>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              className={`${styles.cta} ${inView ? styles.ctaVisible : ''}`}
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? 'Thu gọn sự kiện' : cta} →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
