// src/components/Hero/Hero.jsx
import { heroData } from '../data/content';
import styles from './Hero.module.css';

export default function Hero() {
  const { badge, title, description, cta, stats } = heroData;

  return (
    <section className={styles.hero} id="hero">
      {/* Left content */}
      <div className={`${styles.left} reveal`}>
        <span className={styles.badge}>{badge}</span>

        <h1 className={styles.title}>
          {title.map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h1>

        <p className={styles.desc}>{description}</p>

        <div className={styles.dots}>
          <span className={styles.dotActive} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>

        <button className={styles.cta}>{cta} →</button>
      </div>

      {/* Right image */}
      <div className={`${styles.right} reveal delay-2`}>
        <div className={styles.circle}>
          {/* Thay thẻ này bằng <img src="..." alt="..." /> khi có ảnh thật */}
          <div className={styles.placeholder}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="28" r="14" fill="white" opacity="0.4" />
              <ellipse cx="40" cy="62" rx="24" ry="14" fill="white" opacity="0.4" />
            </svg>
          </div>
        </div>

        <div className={styles.statBadge}>
          <span className={styles.statValue}>{stats.value}</span>
          <span className={styles.statLabel}>{stats.label}</span>
        </div>
      </div>
    </section>
  );
}