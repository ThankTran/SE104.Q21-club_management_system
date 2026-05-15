import styles from './ResourceDeleteConfirmModal.module.css';

export default function ResourceDeleteConfirmModal({ resource, onCancel, onConfirm }) {
  if (!resource) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.box} onClick={(event) => event.stopPropagation()}>
        <div className={styles.icon}>!</div>
        <h3 className={styles.title}>Xóa phiếu tài liệu?</h3>
        <p className={styles.message}>
          Bạn có chắc muốn xóa phiếu <strong>{resource.formCode}</strong> - <em>{resource.title}</em>?
          Hành động này không thể hoàn tác.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>Hủy</button>
          <button type="button" className={styles.deleteBtn} onClick={onConfirm}>Xóa</button>
        </div>
      </div>
    </div>
  );
}
