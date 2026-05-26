import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './MemberPaymentPage.module.css';
import { fmtMoney } from '../../utils/Finance/financeUtils';
import {
  completeTransactionAPI,
  getMemberDuesAPI,
} from '../../services/finance-service';
import useAuthStore from '../../store/auth-store';

export default function MemberPaymentPage() {
  const currentUser = useAuthStore((state) => state.user);
  const memberId = currentUser?.memberId;
  const memberName = currentUser?.fullName || 'Thành viên';
  const memberCode = currentUser?.studentId || (memberId ? `TV${String(memberId).padStart(3, '0')}` : '');

  const [dues, setDues] = useState([]);
  const [activeDue, setActiveDue] = useState(null);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadDues = useCallback(() => {
    if (!memberId) {
      setDues([]);
      setApiError('Khong xac dinh duoc thanh vien dang dang nhap.');
      return;
    }

    setLoading(true);
    getMemberDuesAPI(memberId)
      .then((data) => {
        const next = Array.isArray(data)
          ? data.map(normalizeDueFromTransaction).filter(Boolean)
          : [];
        setDues(next);
        setApiError('');
      })
      .catch((error) => {
        setDues([]);
        setApiError(error?.message || 'Khong tai duoc danh sach khoan can dong.');
      })
      .finally(() => setLoading(false));
  }, [memberId]);

  useEffect(() => {
    loadDues();
  }, [loadDues]);

  const pending = useMemo(() => dues.filter((due) => due.status === 'pending'), [dues]);
  const paid = useMemo(() => dues.filter((due) => due.status === 'paid'), [dues]);

  const handlePay = async (id) => {
    try {
      const completed = await completeTransactionAPI(id);
      const normalized = normalizeDueFromTransaction(completed);
      setDues((prev) => prev.map((due) => (due.id === id ? normalized : due)).filter(Boolean));
      setActiveDue(null);
      setApiError('');
    } catch (error) {
      setApiError(error?.message || 'Khong ghi nhan duoc thanh toan.');
    }
  };

  return (
    <div className={styles.page}>
      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>Danh sách các khoản cần thanh toán</h1>
          <p className={styles.subtitle}>
            Thành viên xem phí sự kiện đã đăng ký và quỹ tháng hiện tại từ dữ liệu tài chính của hệ thống.
          </p>
        </div>
        <div className={styles.memberCard}>
          <span>Đang đăng nhập</span>
          <strong>{memberName}</strong>
          <small>{memberCode}</small>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Khoản cần đóng</h2>
          <button type="button" className={styles.refreshBtn} onClick={loadDues} disabled={loading}>
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        {pending.length === 0 ? (
          <div className={styles.empty}>Không có khoản nào đang chờ đóng.</div>
        ) : (
          <div className={styles.grid}>
            {pending.map((due) => (
              <PaymentCard key={due.id} due={due} onPay={setActiveDue} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Lịch sử đã đóng</h2>
          <span className={styles.countBadge}>{paid.length} khoản</span>
        </div>
        {paid.length === 0 ? (
          <div className={styles.empty}>Chưa có giao dịch nào được ghi nhận.</div>
        ) : (
          <div className={styles.paidList}>
            {paid.map((due) => (
              <div key={due.id} className={styles.paidRow}>
                <div>
                  <strong>{due.lyDo}</strong>
                  <span>{due.transferCode}</span>
                </div>
                <div className={styles.paidMeta}>
                  <span>{fmtMoney(due.soTien)}</span>
                  <small>{due.paidAt ? new Date(due.paidAt).toLocaleString('vi-VN') : 'Đã ghi nhận'}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeDue && (
        <QrPaymentModal
          due={activeDue}
          memberName={memberName}
          memberCode={memberCode}
          onClose={() => setActiveDue(null)}
          onConfirm={() => handlePay(activeDue.id)}
        />
      )}
    </div>
  );
}

function PaymentCard({ due, onPay }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <span className={styles.qrCode}>Mã: {due.id}</span>
          <span className={styles.pendingBadge}>Chờ đóng</span>
        </div>
        <p className={styles.contentLabel}>Nội dung</p>
        <h3>{due.lyDo}</h3>
        <p>{fmtMoney(due.soTien)}</p>
        <button type="button" className={styles.payBtn} onClick={() => onPay(due)}>
          Nộp tiền
        </button>
      </div>
    </article>
  );
}

function QrPaymentModal({ due, memberName, memberCode, onClose, onConfirm }) {
  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        className={styles.qrModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-payment-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.momoHeader}>
          <div>
            <span>Thanh toán MoMo</span>
            <h2 id="qr-payment-title">Quét QR để nộp tiền</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
            x
          </button>
        </div>

        <div className={styles.qrPanel}>
          <div className={styles.momoBrand}>
            <span className={styles.momoLogo}>MoMo</span>
            <strong>CLB Học thuật THMN</strong>
          </div>
          <div className={styles.fakeQr} aria-label={`QR thanh toán ${due.transferCode}`}>
            <span />
            <span />
            <span />
            <small>{due.id}</small>
          </div>
          <p className={styles.scanHint}>Dùng ứng dụng MoMo hoặc ngân hàng để quét mã</p>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.paymentInfo}>
            <div>
              <span>Số tiền</span>
              <strong className={styles.modalAmount}>{fmtMoney(due.soTien)}</strong>
            </div>
            <div>
              <span>Nội dung</span>
              <strong>CLB THMN | {due.transferCode}</strong>
            </div>
            <div>
              <span>Mã chuyển khoản</span>
              <strong>{due.transferCode}</strong>
            </div>
            {due.maSuKien && (
              <div>
                <span>Mã sự kiện</span>
                <strong>{due.maSuKien}</strong>
              </div>
            )}
            <div>
              <span>Người nộp</span>
              <strong>{memberName} - {memberCode}</strong>
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryBtn} onClick={onClose}>
            Để sau
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

function normalizeDueFromTransaction(transaction = {}) {
  const status = String(transaction.status || '').toUpperCase();
  if (!['PENDING', 'COMPLETED', 'APPROVED'].includes(status)) {
    return null;
  }

  return {
    id: transaction.transactionId,
    transferCode: `${transaction.eventId || 'QUY'}-${transaction.transactionId}`,
    lyDo: transaction.description || 'Khoản cần đóng',
    soTien: Number(transaction.amount || 0),
    maSuKien: transaction.eventId || '',
    status: status === 'PENDING' ? 'pending' : 'paid',
    paidAt: transaction.approvedAt || transaction.updatedAt || '',
    targetName: transaction.memberName || transaction.counterpartyName || '',
    raw: transaction,
  };
}
