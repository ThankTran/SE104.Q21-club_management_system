import styles from './MemberStatCard.module.css';

export default function MemberStatCard({ label, value, sub, variant = 'default' }) {
  return (
    <div className={`${styles.statCard} ${styles[`statCard_${variant}`] || ''}`}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      {sub && <p className={styles.statSub}>{sub}</p>}
    </div>
  );
}
