import { useMemo, useState } from 'react';
import styles from './MemberPaymentPage.module.css';
import { fmtMoney } from '../../utils/Finance/financeUtils';
import {
  getTransferDues,
  markTransferDuePaid,
  MEMBER_PAYMENT_PROFILE,
} from '../../utils/Finance/transferDues';

export default function MemberPaymentPage() {
  const [dues, setDues] = useState(() => getTransferDues());
  const [activeDue, setActiveDue] = useState(null);

  const myDues = useMemo(
    () => dues.filter((due) => !due.targetName || due.targetName === MEMBER_PAYMENT_PROFILE.name),
    [dues],
  );
  const pending = useMemo(() => myDues.filter((due) => due.status === 'pending'), [myDues]);
  const paid = useMemo(() => myDues.filter((due) => due.status === 'paid'), [myDues]);

  const handlePay = (id) => {
    setDues(markTransferDuePaid(id));
    setActiveDue(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>Danh sách các khoản cần thanh toán</h1>
          <p className={styles.subtitle}>
            Thành viên xem các khoản đang chờ đóng, quét QR và hệ thống ghi nhận tên cùng thời gian thanh toán.
          </p>
        </div>
        <div className={styles.memberCard}>
          <span>Đang đăng nhập</span>
          <strong>{MEMBER_PAYMENT_PROFILE.name}</strong>
          <small>{MEMBER_PAYMENT_PROFILE.id}</small>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Khoản cần đóng</h2>
          <button type="button" className={styles.refreshBtn} onClick={() => setDues(getTransferDues())}>
            Làm mới
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
                  <small>{new Date(due.paidAt).toLocaleString('vi-VN')}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeDue && (
        <QrPaymentModal
          due={activeDue}
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
        <button type="button" className={styles.payBtn} onClick={() => onPay(due)}>
          Nộp tiền
        </button>
      </div>
    </article>
  );
}

function QrPaymentModal({ due, onClose, onConfirm }) {
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
            ×
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
              <strong>{MEMBER_PAYMENT_PROFILE.name} - {MEMBER_PAYMENT_PROFILE.id}</strong>
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
