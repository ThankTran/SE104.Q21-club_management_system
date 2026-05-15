import styles from './PendingDuesList.module.css';

const MOCK_PENDING_DUES = [
  {
    id: '2410001',
    name: 'Nguyễn Minh Anh',
    role: 'Thành viên',
    month: 'Tháng 5',
    amount: 75000,
  },
  {
    id: '2410002',
    name: 'Trần Quốc Bảo',
    role: 'Thành viên',
    month: 'Tháng 5',
    amount: 75000,
  },
  {
    id: '2410003',
    name: 'Lê Hoàng Nam',
    role: 'Ban học thuật',
    month: 'Tháng 5',
    amount: 75000,
  },
    {
    id: '2410001',
    name: 'Nguyễn Minh Anh',
    role: 'Thành viên',
    month: 'Tháng 5',
    amount: 75000,
  },
  {
    id: '2410002',
    name: 'Trần Quốc Bảo',
    role: 'Thành viên',
    month: 'Tháng 5',
    amount: 75000,
  },
  {
    id: '2410003',
    name: 'Lê Hoàng Nam',
    role: 'Ban học thuật',
    month: 'Tháng 5',
    amount: 75000,
  },
    {
    id: '2410001',
    name: 'Nguyễn Minh Anh',
    role: 'Thành viên',
    month: 'Tháng 5',
    amount: 75000,
  },
  {
    id: '2410002',
    name: 'Trần Quốc Bảo',
    role: 'Thành viên',
    month: 'Tháng 5',
    amount: 75000,
  },
  {
    id: '2410003',
    name: 'Lê Hoàng Nam',
    role: 'Ban học thuật',
    month: 'Tháng 5',
    amount: 75000,
  },
];

const fmtMoney = (value) =>
  `${Number(value || 0).toLocaleString('vi-VN')} ₫`;

export default function PendingDuesList({
  members = MOCK_PENDING_DUES,
  onRemind,
}) {
  const totalAmount = members.reduce(
    (sum, member) => sum + member.amount,
    0,
  );

  const handleRemind = (member) => {
    if (onRemind) {
      onRemind(member);
      return;
    }

    alert(`Đã tạo nhắc nhở cho ${member.name}`);
  };

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
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
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

                <td>
                  <button
                    className={styles.remindBtn}
                    onClick={() => handleRemind(member)}
                  >
                    Nhắc nhở nhanh
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {members.length === 0 && (
          <div className={styles.empty}>
            Tất cả thành viên đã đóng quỹ tháng này
          </div>
        )}
      </div>
    </div>
  );
}