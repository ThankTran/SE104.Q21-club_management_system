import { useState, useEffect, useMemo } from 'react';
import { navLinks } from '../../../data/content';
import styles from './NavbarLanding.module.css';
import { useNavigate } from 'react-router-dom'
import logo from "../../../assets/logo/logo_cnpm.png";

export default function NavbarLanding({ onLoginClick, onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#hero')
  const navigate = useNavigate()

  const sectionIds = useMemo(() => navLinks.map(link => link.href.replace('#', '')), [])

useEffect(() => {
  const onScroll = () => {
    setScrolled(window.scrollY > 20)
  }

  window.addEventListener('scroll', onScroll)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(`#${entry.target.id}`)
        }
      })
    },
    {
      threshold: 0.6,
      rootMargin: '0px',
    }
  )

  sectionIds.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  return () => {
    window.removeEventListener('scroll', onScroll)
    observer.disconnect()
  }
}, [sectionIds])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div 
        className={styles.logo}
        onClick={() => {
          document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })
        }}
        style={{ cursor: 'pointer' }}
      >
        <img  src={logo}
              alt="THMN club logo"
              className={styles.logoImg}/>
          <div className={styles.logoText}>
            <h1 className={styles.logoTitle}>THMN</h1>
              <h2 className={styles.logoSubtitle}>Academic Club</h2>
            </div>
      </div>

      <ul className={styles.links}>
        {navLinks.map((link) => (
          <li key={link.label} className={styles.linkItem}>
            <a href={link.href} 
              onClick={(e) => {
                e.preventDefault()

                const el = document.querySelector(link.href)

                if (el) {
                  el.scrollIntoView({
                    behavior: 'smooth',
                  })
                }

                setMenuOpen(false)
              }}

              className={`${styles.link} ${
                activeLink === link.href ? styles.active : ''
              }`}
            >
              {link.label}
            </a>
            <span className={`${styles.indicator} ${activeLink === link.href ? styles.indicatorActive : ''}`} />
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <button className="btn-outline" onClick={onLoginClick}>
          Đăng nhập
        </button>
        <button className="btn-fill" onClick={onRegisterClick}>
          Đăng ký
        </button>
      </div>

      <button
        onClick={() => navigate('/home')}
        style={{
          background: 'orange',
          color: '#000',
          border: 'none',
          padding: '7px 14px',
          borderRadius: '6px',
          fontWeight: '700',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
            🏠 Test Home
        </button>

      {/* Mobile hamburger */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {menuOpen && (
        <div className={styles.drawer}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={styles.drawerLink}
              onClick={(e) => {
                e.preventDefault()
                
                const el =document.querySelector(link.href)
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' })
                }
                setMenuOpen(false)
              }}
            >
              {link.label}
            </a>
          ))}
          <div className={styles.drawerActions}>
            <button className="btn-outline" onClick={onLoginClick}>
              Đăng nhập
            </button>
            <button className="btn-fill" onClick={onRegisterClick}>
              Đăng ký
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}