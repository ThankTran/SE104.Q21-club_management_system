import styles from './FinanceHeader.module.css';
import FinanceExportButton from './FinanceExportButton';

export default function FinanceHeader({
  onOpenThu,
  onOpenChi,
  thuList,
  chiList,
  bcThu,
  bcChi,
}) 
{
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>Quản lý Thu Chi Quỹ</h1>
        <p className={styles.pageSub}>Hệ thống tài chính câu lạc bộ THMN</p>
      </div>
      <div className={styles.headerBtns}>
        <FinanceExportButton
          thuList={thuList}
          chiList={chiList}
          bcThu={bcThu}
          bcChi={bcChi}
        />
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
