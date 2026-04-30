// src/components/Footer/Footer.jsx
import { footerData } from '../data/content';
import styles from './Footer.module.css';

// Social icons SVG map
const SocialIcon = ({ name }) => {
  const icons = {
    Facebook: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
    YouTube: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1a3d2b" />
      </svg>
    ),
    Instagram: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    Email: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" fill="none" stroke="#1a3d2b" strokeWidth="2" />
      </svg>
    ),
  };
  return icons[name] || null;
};

export default function Footer() {
  const { clubName, tagline, quickAccess, support, legal } = footerData;

  return (
    <footer className={styles.footer} id="footer">
      {/* Social row */}
      <div className={styles.socialRow}>
        {['Facebook', 'YouTube', 'Instagram', 'Email'].map((name) => (
          <a key={name} href="#" className={styles.socialIcon} aria-label={name}>
            <SocialIcon name={name} />
          </a>
        ))}
      </div>

      <div className={styles.divider} />

      {/* Body columns */}
      <div className={styles.body}>
        <div className={styles.col}>
          <p className={styles.clubName}>{clubName}</p>
          <p className={styles.tagline}>{tagline}</p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Quick Access</h4>
          <ul>
            {quickAccess.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={styles.colLink}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Support</h4>
          <ul>
            {support.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={styles.colLink}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <p className={styles.copy}>© 2024 {clubName}. All rights reserved.</p>
        <div className={styles.legalLinks}>
          {legal.map((item) => (
            <a key={item.label} href={item.href} className={styles.legalLink}>{item.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}