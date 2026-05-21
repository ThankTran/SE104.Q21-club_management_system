import styles from './EventEvaluationHistoryModal.module.css';

export default function EventEvaluationHistoryModal({ open, evaluations, onClose, onSelectEvaluation }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Lịch sử đánh giá sự kiện</h3>
            <p className={styles.meta}>{evaluations.length.toLocaleString('vi-VN')} phiếu đánh giá</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Đóng">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Mã sự kiện</th>
                <th>Tên sự kiện</th>
                <th>Ngày đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.length > 0 ? (
                evaluations.map((item) => (
                  <tr
                    key={item.id}
                    className={styles.clickableRow}
                    onClick={() => onSelectEvaluation(item)}
                    title="Xem nhận xét"
                  >
                    <td className={styles.codeCell}>{item.id}</td>
                    <td className={styles.centerCell}>{item.eventCode}</td>
                    <td className={styles.centerCell}>{item.eventTitle}</td>
                    <td className={styles.centerCell}>{item.evaluationDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className={styles.emptyCell} colSpan={4}>Chưa có phiếu đánh giá nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
