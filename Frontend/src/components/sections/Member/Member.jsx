import { useState, useEffect, useRef } from 'react'
import styles from './Member.module.css'
import { membersData } from '../../../data/content'

const AUTO_DELAY = 3000

export default function Members() {
  const members = membersData
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)
  const total = members.length

  // IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Auto play
  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setActive(i => (i + 1) % total)
    }, AUTO_DELAY)
    return () => clearInterval(timer)
  }, [paused, total])

  const prev = () => setActive(i => (i - 1 + total) % total)
  const next = () => setActive(i => (i + 1) % total)

  const getPos = (i) => {
    let diff = i - active
    if (diff > Math.floor(total / 2)) diff -= total
    if (diff < -Math.floor(total / 2)) diff += total
    return diff
  }

  const getCardStyle = (i) => {
    const pos = getPos(i)
    const isActive = pos === 0
    const isHidden = Math.abs(pos) > 2
    const absPos = Math.abs(pos)

    return {
      transform: `translateX(${pos * 260}px) scale(${isActive ? 1 : Math.max(0.7, 1 - absPos * 0.12)})`,
      opacity: isHidden ? 0 : isActive ? 1 : Math.max(0.35, 1 - absPos * 0.3),
      zIndex: 10 - absPos,
      filter: isActive ? 'none' : `brightness(${Math.max(0.6, 1 - absPos * 0.2)})`,
      pointerEvents: isActive ? 'auto' : 'none',
      transition: 'all 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
    }
  }

  return (
    <section
      className={styles.section}
      id="members"
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Floating shape */}
      <div className={styles.shape} />

      {/* Header */}
      <div className={`${styles.header} ${inView ? styles.headerVisible : ''}`}>
        <h2 className={styles.title}>Ban lãnh đạo & Thành viên</h2>
        <p className={styles.desc}>
          Đội ngũ những người trẻ nhiệt huyết, cùng nhau xây dựng và phát triển CLB.
        </p>
      </div>

      {/* Stage */}
      <div className={`${styles.stage} ${inView ? styles.stageVisible : ''}`}>
        {members.map((member, i) => {
          const pos = getPos(i)
          const isActive = pos === 0

          return (
            <div
              key={member.id}
              className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
              style={getCardStyle(i)}
              onClick={() => !isActive && setActive(i)}
            >
              {/* Glow ring khi active */}
              {isActive && <div className={styles.glowRing} />}

              <div className={`${styles.avatar} ${isActive ? styles.avatarActive : ''}`}>
                <img
                  src={member.img}
                  alt={member.name}
                  className={styles.avatarImg}
                />
              </div>

              <div className={styles.info}>
                <p className={styles.name}>{member.name}</p>
                <p className={styles.role}>{member.role}</p>
                {isActive && (
                  <p className={styles.bio}>
                    Thành viên tích cực của CLB, đóng góp nhiều giá trị cho cộng đồng học thuật.
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className={`${styles.controls} ${inView ? styles.controlsVisible : ''}`}>
        <button className={styles.btn} onClick={prev}>←</button>
        <div className={styles.dots}>
          {members.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <button className={styles.btn} onClick={next}>→</button>
      </div>
    </section>
  )
}