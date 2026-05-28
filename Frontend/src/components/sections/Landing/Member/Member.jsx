import { useState, useEffect, useRef } from 'react'
import styles from './Member.module.css'
import {
  getPublicLeadersAPI,
  normalizePublicMemberFromApi,
} from '../../../../services/member-service'
import member1 from '../../../../assets/member/member1.png'
import member2 from '../../../../assets/member/member2.png'
import member3 from '../../../../assets/member/member3.png'
import member4 from '../../../../assets/member/member4.png'
import member5 from '../../../../assets/member/member5.png'

const AUTO_DELAY = 3000
const FALLBACK_IMAGES = [member1, member3, member4, member5, member2]

const isImagePath = (value) =>
  typeof value === 'string' && (
    value.startsWith('http') ||
    value.startsWith('/') ||
    value.startsWith('data:image')
  )

const getMemberImage = (member, index) => {
  const raw = member.raw || {}
  const candidate = raw.avatarUrl || raw.imageUrl || raw.image || raw.img
  return isImagePath(candidate) ? candidate : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
}

export default function Members() {
  const [members, setMembers] = useState([])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const sectionRef = useRef(null)
  const total = members.length

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let ignore = false

    getPublicLeadersAPI()
      .then((data) => {
        if (ignore) return

        const leaders = Array.isArray(data)
          ? data.map(normalizePublicMemberFromApi)
          : []

        setMembers(leaders)
        setActive(0)
        setApiError('')
      })
      .catch((error) => {
        if (ignore) return
        setMembers([])
        setApiError(error?.message || 'Không tải được danh sách ban lãnh đạo.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (total === 0 || active < total) return
    setActive(0)
  }, [active, total])

  useEffect(() => {
    if (paused || total <= 1) return
    const timer = setInterval(() => {
      setActive(i => (i + 1) % total)
    }, AUTO_DELAY)
    return () => clearInterval(timer)
  }, [paused, total])

  const prev = () => {
    if (total <= 1) return
    setActive(i => (i - 1 + total) % total)
  }

  const next = () => {
    if (total <= 1) return
    setActive(i => (i + 1) % total)
  }

  const getPos = (i) => {
    if (total <= 1) return 0
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
      <div className={styles.shape} />

      <div className={`${styles.header} ${inView ? styles.headerVisible : ''}`}>
        <h2 className={styles.title}>Ban lãnh đạo & Thành viên</h2>
        <p className={styles.desc}>
          Đội ngũ những người trẻ nhiệt huyết, cùng nhau xây dựng và phát triển CLB.
        </p>
      </div>

      <div className={`${styles.stage} ${inView ? styles.stageVisible : ''}`}>
        {loading && <p className={styles.stateText}>Đang tải danh sách ban lãnh đạo...</p>}
        {apiError && <p className={styles.stateText}>{apiError}</p>}
        {!loading && !apiError && members.length === 0 && (
          <p className={styles.stateText}>Chưa có dữ liệu ban lãnh đạo để hiển thị.</p>
        )}

        {members.map((member, i) => {
          const pos = getPos(i)
          const isActive = pos === 0

          return (
            <div
              key={member.memberId || member.id}
              className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
              style={getCardStyle(i)}
              onClick={() => !isActive && setActive(i)}
            >
              {isActive && <div className={styles.glowRing} />}

              <div className={`${styles.avatar} ${isActive ? styles.avatarActive : ''}`}>
                <img
                  src={getMemberImage(member, i)}
                  alt={member.name}
                  className={styles.avatarImg}
                />
              </div>

              <div className={styles.info}>
                <p className={styles.name}>{member.name}</p>
                <p className={styles.role}>{member.role}</p>
              </div>
            </div>
          )
        })}
      </div>

      {members.length > 1 && (
        <div className={`${styles.controls} ${inView ? styles.controlsVisible : ''}`}>
          <button className={styles.btn} onClick={prev}>←</button>
          <div className={styles.dots}>
            {members.map((member, i) => (
              <button
                key={member.memberId || member.id}
                className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          <button className={styles.btn} onClick={next}>→</button>
        </div>
      )}
    </section>
  )
}
