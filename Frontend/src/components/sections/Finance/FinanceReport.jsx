import styles from '../../../pages/Finance/FinancePage.module.css';
import { THANG_OPTIONS } from '../Finance/financeConstants';
import { fmtDate, fmtMoney } from '../../../utils/Finance/financeUtils';

export default function BaoCaoQuy({ baocaoThang, setBaocaoThang, bcThu, bcChi, bcTongThu, bcTongChi, bcSoDu }) {
  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <div className={styles.baocaoLeft}>
          <h3 className={styles.tableTitle}>Báo cáo thu chi tháng</h3>
          <p className={styles.baocaoRule}>Mức đóng quỹ chuẩn: 75k/người</p>
        </div>
        <div className={styles.tableActions}>
          <label className={styles.thangLabel}>Chọn tháng:</label>
          <select className={styles.thangSelect} value={baocaoThang} onChange={e => setBaocaoThang(Number(e.target.value))}>
            {THANG_OPTIONS.map(t => <option key={t} value={t}>Tháng {t}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.baocaoCard}>
        <div className={styles.baocaoCardHeader}>
          <h2 className={styles.baocaoTitle}>BÁO CÁO QUỸ</h2>
          <p className={styles.baocaoThang}>Tháng {baocaoThang} / {new Date().getFullYear()}</p>
        </div>

        <table className={styles.table}>
          <thead>
            <tr><th>STT</th><th>NGÀY</th><th>LOẠI</th><th>HOẠT ĐỘNG / MÃ SỰ KIỆN</th><th>NỘI DUNG</th><th>SỐ TIỀN</th></tr>
          </thead>
          <tbody>
            {bcThu.map((r, i) => (
              <tr key={r.id} className={styles.row}>
                <td className={styles.sttCell}>{i + 1}</td>
                <td className={styles.dateCell}>{fmtDate(r.ngayThu)}</td>
                <td><span className={styles.loaiBadgeThu}>THU</span></td>
                <td>{r.maSuKien || '—'}</td>
                <td>{r.lyDo}</td>
                <td><span className={styles.amtThu}>+{fmtMoney(r.soTien)}</span></td>
              </tr>
            ))}
            {bcChi.map((r, i) => (
              <tr key={r.id} className={styles.row}>
                <td className={styles.sttCell}>{bcThu.length + i + 1}</td>
                <td className={styles.dateCell}>{fmtDate(r.ngayLap)}</td>
                <td><span className={styles.loaiBadgeChi}>CHI</span></td>
                <td>{r.maSuKien || '—'}</td>
                <td>{r.noiDung}</td>
                <td><span className={styles.amtChi}>-{fmtMoney(r.soTien)}</span></td>
              </tr>
            ))}
            {bcThu.length === 0 && bcChi.length === 0 && (
              <tr><td colSpan={6} className={styles.emptyRow}>Không có giao dịch nào trong tháng {baocaoThang}</td></tr>
            )}
          </tbody>
        </table>

        <div className={styles.baocaoTotals}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Tổng thu:</span>
            <span className={styles.totalValThu}>{fmtMoney(bcTongThu)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Tổng chi:</span>
            <span className={styles.totalValChi}>{fmtMoney(bcTongChi)}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.totalDuRow}`}>
            <span className={styles.totalLabelDu}>Số dư:</span>
            <span className={bcSoDu >= 0 ? styles.totalValDuPos : styles.totalValDuNeg}>{fmtMoney(Math.abs(bcSoDu))}{bcSoDu < 0 ? ' (âm)' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
