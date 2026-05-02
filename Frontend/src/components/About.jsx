// src/components/About/About.jsx
import { aboutData } from '../data/content';
import styles from './About.module.css';

export default function About() {
  const { tag, title, description, cards } = aboutData;

  return (
    <section className={`${styles.about} reveal`} id="about">
      <span className={`${styles.sectionTag} reveal`}>{tag}</span>
      <h2 className={`${styles.sectionTitle} reveal`}>{title}</h2>
      <p className={`section-desc ${styles.desc} reveal`}>{description}</p>

      <div className={styles.cards}>
        {cards.map((card, i) => (
          <div
            key={i}
            className={`${styles.card} reveal`}
            style={{
              background: card.color,
              height: card.height,
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            <p className={styles.cardLabel}>
              {card.label.split('\n').map((line, j) => (
                <span key={j}>{line}<br /></span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}