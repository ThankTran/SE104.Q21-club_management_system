import { useEffect, useRef, useState } from 'react';
import { eventsData } from '../../../../data/Public/content';
import styles from './Event.module.css';

export default function Events() {
  const { title, description, items, cta } = eventsData;
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.events} id="events" ref={sectionRef}>
      {/* Floating shape giống như About */}
      <div className={styles.shape} />

      <div className={styles.inner}>
        {/* Left image box slide từ trái */}
        <div className={`${styles.imgBox} ${inView ? styles.imgVisible : ''}`}>
          {/* Pulse ring */}
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

        {/* Right content slide từ phải */}
        <div className={`${styles.content} ${inView ? styles.contentVisible : ''}`}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.desc}>{description}</p>

          <ul className={styles.list}>
            {items.map((item, i) => (
              <li
                key={i}
                className={`${styles.item} ${inView ? styles.itemVisible : ''}`}
                style={{ transitionDelay: `${0.3 + i * 0.12}s` }}
              >
                <span className={styles.dot} />
                <div>
                  <strong className={styles.itemTitle}>{item.title}</strong>
                  <p className={styles.itemDesc}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            className={`${styles.cta} ${inView ? styles.ctaVisible : ''}`}
          >
            {cta} →
          </button>
        </div>
      </div>
    </section>
  );
}
