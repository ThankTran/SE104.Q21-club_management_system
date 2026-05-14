import { useEffect, useRef, useState } from 'react';
import { aboutData } from '../../../data/content';
import styles from './About.module.css';

const cardTransforms = [
  { rotate: -14, x: -160, y: 20, scale: 0.86, zIndex: 1 },
  { rotate: -7,  x: -80, y: 10, scale: 0.92, zIndex: 2 },
  { rotate: 0,   x: 0,   y: 0,  scale: 1,    zIndex: 5 },
  { rotate: 7,   x: 80,  y: 10, scale: 0.92, zIndex: 2 },
  { rotate: 14,  x: 160,  y: 20, scale: 0.86, zIndex: 1 },
]

export default function About() {
  const { tag, title, description, cards } = aboutData;
  const [inView, setInView]     = useState(false);
  const [activeIdx, setActiveIdx] = useState(2);
  const [hoveredIdx, setHoveredIdx] = useState(null); // ← track card đang hover
  const [autoPlaying, setAutoPlaying] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto rotate — dừng khi hover
  useEffect(() => {
    if (!autoPlaying) return
    const timer = setInterval(() => {
      setActiveIdx(i => (i + 1) % cards.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [autoPlaying, cards.length])

  const getDiff = (i) => {
    const total = cards.length
    let diff = i - activeIdx
    if (diff > Math.floor(total / 2)) diff -= total
    if (diff < -Math.floor(total / 2)) diff += total
    return Math.max(-2, Math.min(2, diff))
  }

  const getTransform = (i) => {
    const diff = getDiff(i)
    const t = cardTransforms[diff + 2]
    return {
      transform: `translateX(${t.x}px) translateY(${t.y}px) rotate(${t.rotate}deg) scale(${t.scale})`,
      zIndex: i === activeIdx ? 5 : t.zIndex,
    }
  }

  // Brightness theo vị trí, sáng lên khi hover
  const getOverlayOpacity = (i) => {
  if (hoveredIdx === i) return 0        // hover → không overlay
  if (i === activeIdx)  return 0        // active → không overlay
  const diff = Math.abs(getDiff(i))
  if (diff === 1) return 0.35           // cách 1 → overlay trắng 35%
  return 0.6                            // cách 2 → overlay trắng 60%
}

  const prev = () => setActiveIdx(i => (i - 1 + cards.length) % cards.length)
  const next = () => setActiveIdx(i => (i + 1) % cards.length)

  return (
    <section className={styles.about} id="about" ref={sectionRef}>
      <div className={styles.shape} />

      {/* Left */}
      <div className={`${styles.left} ${inView ? styles.leftVisible : ''}`}>
        <span className={`${styles.sectionTag} reveal`}>{tag}</span>
        <h2 className={`${styles.sectionTitle} reveal delay-1`}>{title}</h2>
        <p className={`${styles.desc} reveal delay-2`}>{description}</p>
      </div>

      {/* Right — stack + controls */}
      <div className={`${styles.rightCol} ${inView ? styles.rightVisible : ''}`}>
        <div
          className={styles.stack}
          onMouseEnter={() => setAutoPlaying(false)}
          onMouseLeave={() => { setAutoPlaying(true); setHoveredIdx(null) }}
        >
          {cards.map((card, i) => {
            const { transform, zIndex } = getTransform(i)
            const isActive = i === activeIdx
            return (
              <div
                key={i}
                className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                style={{ background: card.color, transform, zIndex }}
                onClick={() => setActiveIdx(i)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >

                {card.img
                  ? <img src={card.img} alt={card.label} className={styles.cardImg} />
                  : <div className={styles.cardBg} style={{ background: card.color }} />
                }

                <div
                  className={styles.overlay}
                  style={{ opacity: getOverlayOpacity(i) }}
                />
                
                <div className={styles.cardIcon}>
                  {['🔬', '🎤', '🤝', '💡', '🏆'][i]}
                </div>
                <p className={styles.cardLabel}>
                  {card.label.split('\n').map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}
                </p>
                {isActive && <div className={styles.shine} />}
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button className={styles.btn} onClick={prev}>←</button>
          <div className={styles.dots}>
            {cards.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ''}`}
                onClick={() => setActiveIdx(i)}
              />
            ))}
          </div>
          <button className={styles.btn} onClick={next}>→</button>
        </div>
      </div>
    </section>
  );
}