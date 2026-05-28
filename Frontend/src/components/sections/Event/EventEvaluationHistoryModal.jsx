import styles from './EventEvaluationHistoryModal.module.css';

export default function EventEvaluationHistoryModal({ open, events, onClose, onSelectEvent }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Đánh giá sự kiện</h3>
            <p className={styles.meta}>{events.length.toLocaleString('vi-VN')} sự kiện cần đánh giá</p>
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
                <th>Mã sự kiện</th>
                <th>Tên sự kiện</th>
                <th>Ngày kết thúc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((item) => (
                  <tr
                    key={item.id}
                    className={styles.clickableRow}
                    onClick={() => onSelectEvent(item)}
                    title="Đánh giá sự kiện"
                  >
                    <td className={styles.codeCell}>{item.eventCode}</td>
                    <td className={styles.centerCell}>{item.title}</td>
                    <td className={styles.centerCell}>{item.date}</td>
                    <td className={styles.centerCell}>
                      <button
                        className={styles.evaluateBtn}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectEvent(item);
                        }}
                      >
                        Đánh giá
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className={styles.emptyCell} colSpan={4}>Không có sự kiện nào cần đánh giá</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
