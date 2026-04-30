// src/components/About/About.jsx
import { aboutData } from '../data/content';
import styles from './About.module.css';

export default function About() {
  const { tag, title, description, cards } = aboutData;

  return (
    <section className={styles.about} id="about">
      <span className="section-tag">{tag}</span>
      <h2 className="section-title">{title}</h2>
      <p className={`section-desc ${styles.desc}`}>{description}</p>

      <div className={styles.cards}>
        {cards.map((card, i) => (
          <div
            key={i}
            className={`${styles.card} fade-up`}
            style={{
              background: card.color,
              height: card.height,
              animationDelay: `${i * 0.08}s`,
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