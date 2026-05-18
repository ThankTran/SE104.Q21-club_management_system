import styles from './TransferDueTable.module.css';
import { fmtMoney } from '../../../utils/Finance/financeUtils';

export default function TransferDueTable({ dues, onRefresh, onMarkCashPaid, onDelete }) {
  const pending = dues.filter((item) => item.status === 'pending');
  const paid = dues.filter((item) => item.status === 'paid');

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Danh sách ghi nhận chuyển khoản</h3>
          <p className={styles.subtitle}>
            Các khoản này được tạo từ phiếu thu hình thức chuyển khoản. Có thể tick tiền mặt cho member đã đóng trực tiếp hoặc chờ member quét QR ở trang Đóng quỹ.
          </p>
        </div>
        <button type="button" className={styles.refreshBtn} onClick={onRefresh} title="Làm mới danh sách">
          <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 12a9 9 0 11-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
      </div>

      <div className={styles.summary}>
        <span>{pending.length} chờ đóng</span>
        <span>{paid.length} đã ghi nhận</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã QR</th>
              <th>Lý do</th>
              <th>Mã sự kiện</th>
              <th>Người cần đóng</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Ghi nhận</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {dues.map((due) => (
              <tr key={due.id}>
                <td>
                  <div className={styles.codeCell}>
                    <strong>{due.id}</strong>
                    <small>{due.transferCode}</small>
                  </div>
                </td>
                <td>{due.lyDo}</td>
                <td>{due.maSuKien || '—'}</td>
                <td>{due.targetName || '—'}</td>
                <td className={styles.amount}>{fmtMoney(due.soTien)}</td>
                <td>
                  <span className={due.status === 'paid' ? styles.paidBadge : styles.pendingBadge}>
                    {due.status === 'paid' ? 'Đã đóng' : 'Chưa đóng'}
                  </span>
                </td>
                <td>
                  <div className={styles.paidCell}>
                    <span>{due.paidBy || '—'}</span>
                    {due.paidMethod && <small>{due.paidMethod}</small>}
                  </div>
                </td>
                <td>{due.paidAt ? new Date(due.paidAt).toLocaleString('vi-VN') : '—'}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.cashBtn}
                      disabled={due.status === 'paid'}
                      onClick={() => onMarkCashPaid?.(due.id)}
                      title="Tick đã đóng tiền mặt"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => onDelete?.(due.id)}
                      title="Xóa khoản chờ đóng"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v5M14 11v5" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {dues.length === 0 && (
              <tr>
                <td colSpan={9} className={styles.empty}>Chưa có khoản chuyển khoản nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
