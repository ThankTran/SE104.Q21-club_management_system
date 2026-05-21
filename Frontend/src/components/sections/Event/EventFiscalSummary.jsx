import styles from './EventFiscalSummary.module.css';

export default function EventFiscalSummary({ totalEstimated, totalActual }) {
  return (
    <div className={styles.fiscalCard}>
      <div className={styles.fiscalHeader}>
        <h2 className={styles.fiscalTitle}>Hiệu suất Tài chính</h2>
        <span className={styles.fiscalTag}>↗ Tổng quan Q4</span>
      </div>
      <div className={styles.fiscalNumbers}>
        <div>
          <p className={styles.fiscalLabel}>NGÂN SÁCH DỰ KIẾN</p>
          <p className={styles.fiscalValue}>{totalEstimated.toLocaleString('vi-VN')}₫</p>
        </div>
        <div>
          <p className={styles.fiscalLabel}>CHI PHÍ THỰC TẾ</p>
          <p className={`${styles.fiscalValue} ${styles.fiscalActual}`}>
            {Math.round(totalActual).toLocaleString('vi-VN')}₫
          </p>
        </div>
        <div className={styles.fiscalMeta}>
          <p className={styles.fiscalNote}>Chi phí thực tế thấp hơn ~10% so với dự toán.</p>
        </div>
      </div>
      <div className={styles.fiscalBar}>
        <div
          className={styles.fiscalBarFill}
          style={{ width: `${totalEstimated > 0 ? Math.min(100, (totalActual / totalEstimated) * 100) : 0}%` }}
        />
      </div>
    </div>
  );
}
