import { useState } from 'react';
import styles from './ExpenseTable.module.css';
import { fmtDate, fmtMoney } from '../../../utils/Finance/financeUtils';
import FinanceFilter from './FinanceFilter';

export default function ExpenseTable({
  chiList,
  filteredChi,
  searchChi,
  setSearchChi,
  onOpenChi,
  onEditChi,
  setDeleteTarget,
  onApproveChi,
  canApproveExpense = false,
  sortChi,
  setSortChi,
  filters,
  setFilters,
}) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>
          Danh sách phiếu chi <span className={styles.tableBadgeChi}>{chiList.length} phiếu</span>
        </h3>
        <div className={styles.tableActions}>
          <div className={styles.searchWrap}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input className={styles.searchInput} placeholder="Tìm phiếu chi..." value={searchChi} onChange={e => setSearchChi(e.target.value)} />
          </div>
          <FinanceFilter
            open={filterOpen}
            setOpen={setFilterOpen}
            type="expense"
            filters={filters}
            setFilters={setFilters}
          />
          <button className={styles.btnChi} onClick={onOpenChi}>+ Lập phiếu chi</button>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Người nhận</th>
              <th>Nội dung chi</th>
              <th>Mã sự kiện</th>
              <th>
                <button
                  className={styles.sortBtn}
                  onClick={() => setSortChi(sortChi === 'asc' ? 'desc' : 'asc')}
                >
                  Ngày lập {sortChi === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredChi.map((r) => (
              <tr key={r.id} className={styles.row}>
                <td><span className={styles.idBadgeChi}>{r.id}</span></td>
                <td className={styles.nameCell}>{r.nguoiNhan}</td>
                <td>{r.noiDung}</td>
                <td>{r.maSuKien ? <span className={styles.skBadge}>{r.maSuKien}</span> : <span className={styles.naBadge}>-</span>}</td>
                <td className={styles.dateCell}>{fmtDate(r.ngayLap)}</td>
                <td><span className={styles.amtChi}>{fmtMoney(r.soTien)}</span></td>
                <td><span className={styles.statusBadge}>{formatExpenseStatus(r.status)}</span></td>
                <td>
                  <div className={styles.rowActions}>
                    {isPending(r.status) && canApproveExpense && (
                      <button className={styles.approveBtn} onClick={() => onApproveChi(r)}>Duyệt</button>
                    )}
                    <button className={styles.editBtn} onClick={() => onEditChi(r)}>Sửa</button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteTarget(r)}>Xóa</button>
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
        <span className={styles.totalChi}>Tổng chi đã duyệt: {fmtMoney(filteredChi.filter(isSettledTransaction).reduce((s, r) => s + r.soTien, 0))}</span>
      </div>
    </div>
  );
}

function isPending(status) {
  return String(status || '').toUpperCase() === 'PENDING';
}

function isSettledTransaction(item) {
  return ['COMPLETED', 'APPROVED'].includes(String(item?.status || item?.raw?.status || '').toUpperCase());
}

function formatExpenseStatus(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'COMPLETED' || value === 'APPROVED') return 'Đã duyệt';
  if (value === 'REJECTED') return 'Từ chối';
  return 'Chờ duyệt';
}
