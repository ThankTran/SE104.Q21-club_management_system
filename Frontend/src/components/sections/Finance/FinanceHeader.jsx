import styles from '../../../pages/Finance/FinancePage.module.css';

export default function PageHeader({ onOpenThu, onOpenChi }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>Quản lý Thu Chi Quỹ</h1>
        <p className={styles.pageSub}>Hệ thống tài chính câu lạc bộ THMN</p>
      </div>
      <div className={styles.headerBtns}>
        <button className={styles.btnThu} onClick={onOpenThu}>
          <span>+</span> Lập phiếu thu
        </button>
        <button className={styles.btnChi} onClick={onOpenChi}>
          <span>+</span> Lập phiếu chi
        </button>
      </div>
    </div>
  );
}
