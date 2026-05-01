// src/components/Members.jsx
import { useState, useRef, useEffect } from 'react'
import styles from './Member.module.css'

const members = [
  { id: 1, name: 'Nguyễn Văn A', role: 'Chủ nhiệm CLB' },
  { id: 2, name: 'Trần Thị B',   role: 'Phó chủ nhiệm' },
  { id: 3, name: 'Lê Văn C',     role: 'Trưởng ban học thuật' },
  { id: 4, name: 'Phạm Thị D',   role: 'Trưởng ban truyền thông' },
  { id: 5, name: 'Hoàng Văn E',  role: 'Trưởng ban sự kiện' },
  { id: 6, name: 'Đỗ Thị F',     role: 'Thành viên' },
  { id: 7, name: 'Vũ Văn G',     role: 'Thành viên' },
  { id: 8, name: 'Bùi Thị H',    role: 'Thành viên' },
]

// Clone đủ để băng chuyền liền mạch
const looped = [...members, ...members]

const CARD_WIDTH = 260
const GAP = 24
const STEP = CARD_WIDTH + GAP

export default function Members() {
  const [offset, setOffset] = useState(0)
  const [paused, setPaused] = useState(false)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)
  const SPEED = 0.04 // px per ms

  // Tổng chiều rộng 1 bộ
  const totalWidth = members.length * STEP

  // Auto scroll bằng requestAnimationFrame — mượt hơn setInterval
  useEffect(() => {
    const animate = (time) => {
      if (!paused) {
        if (lastTimeRef.current !== null) {
          const delta = time - lastTimeRef.current
          setOffset(prev => {
            const next = prev + SPEED * delta
            // Reset khi đi hết 1 bộ
            return next >= totalWidth ? next - totalWidth : next
          })
        }
        lastTimeRef.current = time
      } else {
        lastTimeRef.current = null
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [paused, totalWidth])

  // Nút prev/next — nhảy 1 card
  const prev = () => setOffset(o => {
    const next = o - STEP
    return next < 0 ? next + totalWidth : next
  })

  const next = () => setOffset(o => {
    const next = o + STEP
    return next >= totalWidth ? next - totalWidth : next
  })

  return (
    <section className={`${styles.section} reveal`} id="members">
      {/* Header */}
      <div className={`${styles.header} reveal`}>
        <span className={styles.tag}>Thành viên</span>
        <h2 className={styles.title}>Ban lãnh đạo & Thành viên</h2>
        <p className={styles.desc}>
          Đội ngũ những người trẻ nhiệt huyết, cùng nhau xây dựng và phát triển CLB.
        </p>
      </div>

      {/* Prev button */}
      <div className={styles.carouselRow}>
        <button className={styles.btn} onClick={prev}>←</button>

        {/* Belt */}
        <div
          className={styles.viewport}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className={styles.track}
            style={{ transform: `translateX(-${offset}px)` }}
          >
            {looped.map((member, i) => (
              <div 
                key={i} 
                className={`${styles.card} reveal`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className={styles.avatar}>
                  <svg width="44" height="44" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="28" r="18" fill="white" opacity="0.5" />
                    <ellipse cx="40" cy="68" rx="28" ry="16" fill="white" opacity="0.5" />
                  </svg>
                </div>
                <div className={styles.info}>
                  <p className={styles.name}>{member.name}</p>
                  <p className={styles.role}>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button className={styles.btn} onClick={next}>→</button>
      </div>
    </section>
  )
}