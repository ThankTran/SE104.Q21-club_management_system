import { useState, useEffect, useRef } from 'react'
import { heroData } from '../../../../data/Public/content'
import styles from './Hero.module.css'
import useCounter from '../../../../hooks/useCounter'
import useTyping from '../../../../hooks/useTyping'

// Particle component
function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 12 + 6,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.35 + 0.1,
      hue: [210, 220, 200][Math.floor(Math.random() * 3)],
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.alpha})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > W) p.dx *= -1
        if (p.y < 0 || p.y > H) p.dy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.particles} />
}

// Main component
export default function Hero() {
  const { avatar, slides, stats } = heroData
  const [slideIdx, setSlideIdx] = useState(0)
  const [inView, setInView] = useState(false)
  const [hasStarted, setHasStarted] = useState(false) // ← chỉ true 1 lần
  const [direction, setDirection] = useState(1)        // 1 = phải→trái, -1 = trái→phải
  const heroRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true) // ← chỉ set true 1 lần duy nhất
        }
      },
      { threshold: 0.2 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [hasStarted])

  // Đổi slide có direction
  const changeSlide = (idx) => {
    setDirection(idx > slideIdx ? 1 : -1)
    setSlideIdx(idx)
  }

  // Auto slide luôn sang phải
  useEffect(() => {
    if (!inView) return
    const timer = setInterval(() => {
      setDirection(1)
      setSlideIdx(i => (i + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [inView, slides.length])

  const count = useCounter(500, 2200, inView)

  // hasStarted thay vì inView type 1 lần không reset
  const { displayed, done, lineIdx } = useTyping(slides[0].title, 55, hasStarted)

  const { badge, cta } = slides[0]
  const { description } = slides[slideIdx]

  return (
    <section className={styles.hero} id="hero" ref={heroRef}>
      <Particles />
      <div className={styles.shape1} />
      <div className={styles.shape2} />
      <div className={styles.shape3} />

      {/* Left */}
      <div className={`${styles.left} ${inView ? styles.leftVisible : ''}`}>
        <span className={styles.badge}>{badge}</span>

        <h1 className={styles.title}>
          {displayed.map((line, i) => (
            <span key={i} className={styles.titleLine}>
              {line}
              {!done && i === lineIdx && <span className={styles.cursor}>|</span>}
              <br />
            </span>
          ))}
        </h1>

        {/* key="slideIdx-direction" để trigger animation đúng hướng */}
        <p
          key={`${slideIdx}-${direction}`}
          className={`${styles.desc} ${inView ? styles.descVisible : ''} ${
            direction === 1 ? styles.slideInRight : styles.slideInLeft
          }`}
        >
          {description}
        </p>

        <div className={`${styles.dots} ${inView ? styles.dotsVisible : ''}`}>
          {slides.map((_, i) => (
            <span
              key={i}
              className={i === slideIdx ? styles.dotActive : styles.dot}
              onClick={() => changeSlide(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>

        <button className={`${styles.cta} ${inView ? styles.ctaVisible : ''}`}>
          {cta} →
        </button>
      </div>

      {/* Right */}
      <div className={`${styles.right} ${inView ? styles.rightVisible : ''}`}>
        <div className={styles.circleWrap}>
          <div className={styles.circlePulse} />
          <div className={styles.circle}>
            <img src={avatar} alt="CLB" style={{ width:'130%', height:'100%', objectFit:'cover' }} />
          </div>
        </div>

        <div className={`${styles.statBadge} ${inView ? styles.statVisible : ''}`}>
          <span className={styles.statValue}>{count}+</span>
          <span className={styles.statLabel}>{stats.label}</span>
        </div>

        <div className={`${styles.statBadge2} ${inView ? styles.stat2Visible : ''}`}>
          <span className={styles.statValue2}>10+</span>
          <span className={styles.statLabel2}>Sự kiện / năm</span>
        </div>
      </div>
    </section>
  )
}
