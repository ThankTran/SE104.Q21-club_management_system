import styles from './FinanceStats.module.css';
import { fmtMoney } from '../../../utils/Finance/financeUtils';

export default function SummaryCards({ tongThu, tongChi, soDu, thuCount, chiCount, bcThu, baocaoThang }) {
  return (
    <div className={styles.summaryRow}>
      <div className={`${styles.summaryCard} ${styles.summaryThu}`}>
        <div className={styles.summaryIcon}>💰</div>
        <div>
          <p className={styles.summaryLabel}>TỔNG THU</p>
          <p className={styles.summaryValue}>{fmtMoney(tongThu)}</p>
          <p className={styles.summarySub}>{thuCount} phiếu thu</p>
        </div>
      </div>
      <div className={`${styles.summaryCard} ${styles.summaryChi}`}>
        <div className={styles.summaryIcon}>💸</div>
        <div>
          <p className={styles.summaryLabel}>TỔNG CHI</p>
          <p className={styles.summaryValue}>{fmtMoney(tongChi)}</p>
          <p className={styles.summarySub}>{chiCount} phiếu chi</p>
        </div>
      </div>
      <div className={`${styles.summaryCard} ${soDu >= 0 ? styles.summaryDuPos : styles.summaryDuNeg}`}>
        <div className={styles.summaryIcon}>{soDu >= 0 ? '🏦' : '⚠️'}</div>
        <div>
          <p className={styles.summaryLabel}>SỐ DƯ QUỸ</p>
          <p className={styles.summaryValue}>{fmtMoney(Math.abs(soDu))}</p>
          <p className={styles.summarySub}>{soDu >= 0 ? 'Dương — tốt' : 'Âm — cần kiểm tra'}</p>
        </div>
      </div>
      <div className={`${styles.summaryCard} ${styles.summaryQuy}`}>
        <div className={styles.summaryIcon}>📅</div>
        <div>
          <p className={styles.summaryLabel}>QUỸ THÁNG NÀY</p>
          <p className={styles.summaryValue}>{fmtMoney(bcThu.reduce((s, r) => s + r.soTien, 0))}</p>
          <p className={styles.summarySub}>Tháng {baocaoThang} · Mức đóng quỹ chuẩn: 75k/người</p>
        </div>
      </div>
    </div>
  );
}
