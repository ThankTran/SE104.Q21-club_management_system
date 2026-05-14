import styles from '../../../pages/Finance/FinancePage.module.css';

export default function ConfirmModal({ item, onConfirm, onCancel }) {
  if (!item) return null;
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
        <div className={styles.confirmIcon}>⚠️</div>
        <h3 className={styles.confirmTitle}>Xoá phiếu?</h3>
        <p className={styles.confirmMsg}>Bạn có chắc muốn xoá <strong>{item.id}</strong>? Hành động này không thể hoàn tác.</p>
        <div className={styles.confirmActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Huỷ</button>
          <button className={`${styles.submitBtn} ${styles.deleteConfirmBtn}`} onClick={onConfirm}>Xoá</button>
        </div>
      </div>
    </div>
  );
}
