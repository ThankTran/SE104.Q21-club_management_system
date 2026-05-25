import styles from './PendingDuesList.module.css';

const fmtMoney = (value) =>
  `${Number(value || 0).toLocaleString('vi-VN')} đ`;

export default function PendingDuesList({
  members = [],
  loading = false,
}) {
  const totalAmount = members.reduce(
    (sum, member) => sum + Number(member.amount || 0),
    0,
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            Thành viên chưa đóng quỹ
          </h3>
          <p className={styles.subtitle}>
            Danh sách chưa hoàn thành quỹ tháng hiện tại
          </p>
        </div>

        <div className={styles.summary}>
          <span>{members.length} thành viên</span>
          <strong>{fmtMoney(totalAmount)}</strong>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã TV</th>
              <th>Thành viên</th>
              <th>Vai trò</th>
              <th>Kỳ quỹ</th>
              <th>Số tiền</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.transactionId || member.id}>
                <td>
                  <span className={styles.idBadge}>
                    {member.id}
                  </span>
                </td>

                <td className={styles.name}>
                  {member.name}
                </td>

                <td>{member.role}</td>

                <td>
                  <span className={styles.monthBadge}>
                    {member.month}
                  </span>
                </td>

                <td className={styles.amount}>
                  {fmtMoney(member.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && members.length === 0 && (
          <div className={styles.empty}>
            Tất cả thành viên đã đóng quỹ tháng này
          </div>
        )}

        {loading && (
          <div className={styles.empty}>
            Đang tải danh sách chưa đóng quỹ...
          </div>
        )}
      </div>
    </div>
  );
}
