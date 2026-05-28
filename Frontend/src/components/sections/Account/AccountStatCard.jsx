import styles from "./AccountStatCard.module.css";

export default function AccountStatCard({ icon, label, value, sub, variant = "default" }) {
  const IconComponent = icon;

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.iconWrap}>
        <IconComponent size={18} />
      </div>
      <div>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        <p className={styles.sub}>{sub}</p>
      </div>
    </div>
  );
}
