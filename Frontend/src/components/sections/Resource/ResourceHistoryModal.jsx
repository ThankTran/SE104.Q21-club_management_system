import { useMemo, useState } from 'react';
import ResourceTable from './ResourceTable';
import styles from './ResourceHistoryModal.module.css';

const STATUS_FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'approved', label: 'Được duyệt' },
  { value: 'rejected', label: 'Từ chối' },
];

export default function ResourceHistoryModal({
  open,
  resources,
  onClose,
  onView,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredResources = useMemo(() => {
    return resources
      .filter((resource) => {
        const handledDate = resource.reviewedAt || resource.createdAt;
        const handledDay = handledDate ? handledDate.slice(0, 10) : '';
        const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
        const matchesFromDate = !fromDate || (handledDay && handledDay >= fromDate);
        const matchesToDate = !toDate || (handledDay && handledDay <= toDate);

        return matchesStatus && matchesFromDate && matchesToDate;
      })
      .sort((a, b) => new Date(b.reviewedAt || b.createdAt) - new Date(a.reviewedAt || a.createdAt));
  }, [fromDate, resources, statusFilter, toDate]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Lịch sử xét duyệt tài liệu</h2>
            <p className={styles.subtitle}>Các tài liệu đã được duyệt hoặc từ chối.</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.filters}>
          <div className={styles.statusFilters} aria-label="Lọc trạng thái">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`${styles.filterBtn} ${statusFilter === filter.value ? styles.filterBtnActive : ''}`}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className={styles.dateFilters}>
            <label className={styles.dateField}>
              <span>Từ ngày</span>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
              />
            </label>
            <label className={styles.dateField}>
              <span>Đến ngày</span>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
              />
            </label>
            {(fromDate || toDate) && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                }}
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>

        <div className={styles.resultInfo}>
          Hiển thị {filteredResources.length.toLocaleString('vi-VN')} trong tổng số {resources.length.toLocaleString('vi-VN')} tài liệu
        </div>

        <div className={styles.tableArea}>
          <ResourceTable
            resources={filteredResources}
            total={filteredResources.length}
            page={1}
            totalPages={1}
            pageSize={Math.max(filteredResources.length, 1)}
            onPageChange={() => {}}
            onView={onView}
            showActions={false}
            showPagination={false}
            verticalScroll
            dateLabel="NGÀY XỬ LÝ"
            dateKey="reviewedAt"
            loading={false}
          />
        </div>
      </div>
    </div>
  );
}
