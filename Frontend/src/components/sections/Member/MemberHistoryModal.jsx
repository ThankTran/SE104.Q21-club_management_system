import { useMemo, useState } from 'react';

import styles from './MemberHistoryModal.module.css';


export default function MemberHistoryModal({ open, members, onClose, onView }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const handledDate = member.reviewedAt || member.registeredAt;
      const handledDay = handledDate ? handledDate.slice(0, 10) : '';
      const matchesStatus = statusFilter === 'all' || member.requestStatus === statusFilter;
      const matchesFrom = !fromDate || (handledDay && handledDay >= fromDate);
      const matchesTo = !toDate || (handledDay && handledDay <= toDate);
      return matchesStatus && matchesFrom && matchesTo;
    });
  }, [fromDate, members, statusFilter, toDate]);

  if (!open) return null;

  return (
    <div className={styles.historyOverlay} onClick={onClose}>
      <div className={styles.historyModal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.historyHeader}>
          <div>
            <h2>Lịch sử xét duyệt thành viên</h2>
            <p>Các hồ sơ đã được duyệt hoặc từ chối, sắp xếp theo ngày xử lý mới nhất.</p>
          </div>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Đóng">×</button>
        </div>

        <div className={styles.historyFilters}>
          <div className={styles.historyStatusFilters}>
            {[
              ['all', 'Tất cả'],
              ['Đã duyệt', 'Được duyệt'],
              ['Từ chối', 'Từ chối'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`${styles.historyFilterBtn} ${statusFilter === value ? styles.historyFilterActive : ''}`}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.historyDateFilters}>
            <label>
              <span>Từ ngày</span>
              <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
            </label>
            <label>
              <span>Đến ngày</span>
              <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
            </label>
            {(fromDate || toDate) && (
              <button type="button" onClick={() => { setFromDate(''); setToDate(''); }}>
                Xóa lọc
              </button>
            )}
          </div>
        </div>

        <div className={styles.historyInfo}>
          Hiển thị {filteredMembers.length.toLocaleString('vi-VN')} trong tổng số {members.length.toLocaleString('vi-VN')} hồ sơ
        </div>

        <div className={styles.historyTableWrap}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Thành viên</th>
                <th>Khoa</th>
                <th>Kết quả</th>
                <th>Người xét duyệt</th>
                <th>Ngày xử lý</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} onClick={() => onView(member)}>
                  <td>
                    <strong>{member.name}</strong>
                    <span>MSSV: {member.id}</span>
                  </td>
                  <td>{member.department}</td>
                  <td>
                    <span className={`${styles.historyStatus} ${member.requestStatus === 'Đã duyệt' ? styles.historyApproved : styles.historyRejected}`}>
                      {member.requestStatus}
                    </span>
                  </td>
                  <td>{member.reviewedBy || 'Chưa cập nhật'}</td>
                  <td>{member.reviewedAt || member.registeredAt}</td>
                  <td>{member.reviewNote || 'Không có'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


