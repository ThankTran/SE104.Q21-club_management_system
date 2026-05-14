import styles from '../../../pages/Finance/FinancePage.module.css';
import { fmtDate, fmtMoney } from '../../../utils/Finance/financeUtils';

export default function ExpenseTable({
  chiList,
  filteredChi,
  searchChi,
  setSearchChi,
  onOpenChi,
  onEditChi,
  setDeleteTarget,
  sortChi,
  setSortChi,
}) {
  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>Danh sách phiếu chi <span className={styles.tableBadgeChi}>{chiList.length} phiếu</span></h3>
        <div className={styles.tableActions}>
          <div className={styles.searchWrap}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input className={styles.searchInput} placeholder="Tìm phiếu chi..." value={searchChi} onChange={e => setSearchChi(e.target.value)} />
          </div>
          <button className={styles.btnChi} onClick={onOpenChi}>+ Lập phiếu chi</button>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>MÃ PHIẾU</th>
              <th>NGƯỜI NHẬN</th>
              <th>NỘI DUNG CHI</th>
              <th>MÃ SỰ KIỆN</th>
              <th>
                <button
                  className={styles.sortBtn}
                  onClick={() => setSortChi(sortChi === 'asc' ? 'desc' : 'asc')}
                >
                  Ngày lập {sortChi === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>SỐ TIỀN</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredChi.map(r => (
              <tr key={r.id} className={styles.row}>
                <td><span className={styles.idBadgeChi}>{r.id}</span></td>
                <td className={styles.nameCell}>{r.nguoiNhan}</td>
                <td>{r.noiDung}</td>
                <td>{r.maSuKien ? <span className={styles.skBadge}>{r.maSuKien}</span> : <span className={styles.naBadge}>—</span>}</td>
                <td className={styles.dateCell}>{fmtDate(r.ngayLap)}</td>
                <td><span className={styles.amtChi}>{fmtMoney(r.soTien)}</span></td>
                <td>
                  <div className={styles.rowActions}>
                    <button className={styles.editBtn} onClick={() => onEditChi(r)}>Sửa</button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteTarget(r)}>Xoá</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredChi.length === 0 && <div className={styles.empty}>Không tìm thấy phiếu chi nào</div>}
      </div>
      <div className={styles.tableFoot}>
        <span>Tổng {filteredChi.length} phiếu</span>
        <span className={styles.totalChi}>Tổng chi: {fmtMoney(filteredChi.reduce((s, r) => s + r.soTien, 0))}</span>
      </div>
    </div>
  );
}
