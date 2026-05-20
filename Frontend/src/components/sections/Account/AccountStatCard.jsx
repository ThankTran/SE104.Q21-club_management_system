import styles from "./AccountStatCard.module.css";

export default function AccountStatCard({ icon: Icon, label, value, sub, variant = "default" }) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.iconWrap}>
        <Icon size={18} />
      </div>
      <div>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        <p className={styles.sub}>{sub}</p>
      </div>
    </div>
  );
}
