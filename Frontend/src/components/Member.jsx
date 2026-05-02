// src/components/Members.jsx
import { useState, useEffect } from 'react'
import styles from './Member.module.css'

const members = [
  { id: 1, name: 'Nguyễn Văn A', role: 'Chủ nhiệm CLB' },
  { id: 2, name: 'Trần Thị B',   role: 'Phó chủ nhiệm' },
  { id: 3, name: 'Lê Văn C',     role: 'Trưởng ban học thuật' },
  { id: 4, name: 'Phạm Thị D',   role: 'Trưởng ban truyền thông' },
  { id: 5, name: 'Hoàng Văn E',  role: 'Trưởng ban sự kiện' },
]

// Clone đủ để băng chuyền liền mạch
const AUTO_DELAY = 3000

export default function Members() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = members.length

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setActive(i => (i + 1) % total)
    }, AUTO_DELAY)
    return () => clearInterval(timer)
  }, [paused, total])

  // Nút prev/next — nhảy 1 card
  const prev = () => setActive(i => (i - 1 + total) % total)
  const next = () => setActive(i => (i + 1) % total)

  const getPos = (i) => {
    let diff = i - active
    if (diff > Math.floor(total / 2)) diff -= total
    if (diff < -Math.floor(total / 2)) diff += total
    return diff
  }

  return (
    <section 
      className={styles.section} id="members"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className={`${styles.header} reveal`}>
        <span className={styles.tag}>Thành viên</span>
        <h2 className={styles.title}>Ban lãnh đạo & Thành viên</h2>
        <p className={styles.desc}>
          Đội ngũ những người trẻ nhiệt huyết, cùng nhau xây dựng và phát triển CLB.
        </p>
      </div>

      {/* Prev button */}
      <div className={`${styles.stage} reveal`}>
        {members.map((member, i) => {
          const pos = getPos(i)
          const isActive = pos === 0
          const isHidden = Math.abs(pos) > 2

          return (
            <div
              key={member.id}
              className={styles.card}
              style={{
                transform: `
                  translateX(${pos * 220}px)
                  scale(${isActive ? 1 : 0.9})  
                `,
                opacity: isHidden ? 0 : Math.max(0.3, 1 - Math.abs(pos) * 0.35),
                zIndex: 10 - Math.abs(pos),
                filter: isActive ? 'none' : `blur(${Math.abs(pos) * 0.5}px)`,
                pointerEvents: isActive ? 'auto' : 'none',
                transition: 'all 0.5s ease',
              }}
              onClick={() => !isActive && setActive(i)}
            >
              <div className={`${styles.avatar} ${isActive ? styles.avatarActive : ''}`}>
                <svg width="52" height="52" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="28" r="18" fill="white" opacity="0.6" />
                  <ellipse cx="40" cy="68" rx="28" ry="16" fill="white" opacity="0.6" />
                </svg>
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

      <div className={`${styles.controls} reveal`}>
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