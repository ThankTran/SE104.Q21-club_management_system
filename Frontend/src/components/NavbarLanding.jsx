// src/components/Navbar/Navbar.jsx
import { useState, useEffect } from 'react';
import { navLinks } from '../data/content';
import styles from './NavbarLanding.module.css';

export default function NavbarLanding({ onLoginClick, onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>A</div>

      <ul className={styles.links}>
        {navLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href} className={styles.link}>{link.label}</a>
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
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className={styles.drawerActions}>
            <button className="btn-outline" onClick={onLoginClick}>
              Đăng nhập
            </button>
            <button className="btn-fill" onClick={onRegisterClick}>Đăng ký</button>
          </div>
        </div>
      )}
    </nav>
  );
}