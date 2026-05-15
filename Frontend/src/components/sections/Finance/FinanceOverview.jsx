import styles from './FinanceOverview.module.css';
import { fmtDate, fmtMoney } from '../../../utils/Finance/financeUtils';
import FinanceCharts from './FinanceCharts';

export default function OverviewPanel({ thuList, chiList, setTab }) {
  return (
    <div className={styles.overviewGrid}>
      <div className={styles.overviewPanel}>
        <div className={styles.panelHead}>
          <h3 className={styles.panelTitle}>Thu gần đây</h3>
          <button className={styles.panelLink} onClick={() => setTab('thu')}>Xem tất cả →</button>
        </div>
        {thuList.slice(-5).reverse().map(r => (
          <div key={r.id} className={styles.recentRow}>
            <div className={styles.recentIcon} style={{ background: '#dcfce7', color: '#15803d' }}>↑</div>
            <div className={styles.recentInfo}>
              <p className={styles.recentName}>{r.nguoiNop}</p>
              <p className={styles.recentSub}>{r.lyDo} · {fmtDate(r.ngayThu)}</p>
            </div>
            <span className={styles.recentAmt} style={{ color: '#15803d' }}>+{fmtMoney(r.soTien)}</span>
          </div>
        ))}
      </div>
      <div className={styles.overviewPanel}>
        <div className={styles.panelHead}>
          <h3 className={styles.panelTitle}>Chi gần đây</h3>
          <button className={styles.panelLink} onClick={() => setTab('chi')}>Xem tất cả →</button>
        </div>
        {chiList.slice(-5).reverse().map(r => (
          <div key={r.id} className={styles.recentRow}>
            <div className={styles.recentIcon} style={{ background: '#fee2e2', color: '#b91c1c' }}>↓</div>
            <div className={styles.recentInfo}>
              <p className={styles.recentName}>{r.nguoiNhan}</p>
              <p className={styles.recentSub}>{r.noiDung} · {fmtDate(r.ngayLap)}</p>
            </div>
            <span className={styles.recentAmt} style={{ color: '#b91c1c' }}>-{fmtMoney(r.soTien)}</span>
          </div>
        ))}
      </div>
      <FinanceCharts thuList={thuList} chiList={chiList} />
    </div>
  );
}
