// src/components/Events/Events.jsx
import { eventsData } from '../data/content';
import styles from './Event.module.css';

export default function Events() {
  const { tag, title, description, items, cta } = eventsData;

  return (
    <section className={styles.events} id="events">
      <div className={styles.inner}>
        {/* Left placeholder image */}
        <div className={`${styles.imgBox} reveal`}>
          {/* Thay bằng <img src="..." alt="..." /> khi có ảnh thật */}
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ opacity: 0.3 }}>
            <rect x="6" y="10" width="48" height="40" rx="4" stroke="#3d5a6c" strokeWidth="2.5" />
            <path d="M6 22h48" stroke="#3d5a6c" strokeWidth="2.5" />
            <path d="M20 6v8M40 6v8" stroke="#3d5a6c" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right content */}
        <div className={styles.content}>
          <span className={`${styles.sectionTag} reveal`}>{tag}</span>
          <h2 className={`${styles.sectionTitle} reveal delay-1`}>{title}</h2>
          <p className={`${styles.desc} reveal delay-2`}>{description}</p>

          <ul className={styles.list}>
            {items.map((item, i) => (
              <li 
                key={i} 
                className={`${styles.item} reveal`}
                style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className={styles.dot} />
                <div>
                  <strong className={styles.itemTitle}>{item.title}</strong>
                  <p className={styles.itemDesc}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <button className={`${styles.cta} reveal`}>{cta} →</button>
        </div>
      </div>
    </section>
  );
}