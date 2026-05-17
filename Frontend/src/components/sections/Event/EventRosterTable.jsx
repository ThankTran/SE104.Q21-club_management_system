import EventFilter from './EventFilter';
import styles from './EventRosterTable.module.css';

const getRateClass = (rate) => {
  if (rate >= 80) return styles.rateHigh;
  if (rate >= 50) return styles.rateMedium;
  return styles.rateLow;
};

const STATUS_ACTIONS = {
  draft: { label: 'Sắp diễn ra', nextStatus: 'upcoming' },
  upcoming: { label: 'Đang diễn ra', nextStatus: 'published' },
  published: { label: 'Kết thúc', nextStatus: 'completed' },
};

export default function EventRosterTable({
  events,
  filteredCount,
  summary,
  page,
  totalPages,
  search,
  setSearch,
  setPage,
  filterOpen,
  setFilterOpen,
  statusFilter,
  setStatusFilter,
  tagFilter,
  setTagFilter,
  dateSort,
  setDateSort,
  publishedCount,
  statusLabels,
  tagLabels,
  tagFilters,
  evaluations,
  onEdit,
  onEvaluate,
  onViewRegistrations,
  onUpdateStatus,
  onDelete,
}) {
  return (
    <div className={styles.rosterCard}>
      <div className={styles.rosterHeader}>
        <h2 className={styles.rosterTitle}>Danh sách Sự kiện</h2>
        <div className={styles.rosterActions}>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Tìm sự kiện..."
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            />
          </div>
          <EventFilter
            open={filterOpen}
            setOpen={setFilterOpen}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            statuses={statusLabels}
            tags={tagFilters}
          />
          <span className={styles.publishedBadge}>{publishedCount} đang diễn ra</span>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryItem}>
          <p className={styles.summaryLabel}>Số lượng hoạt động</p>
          <strong>{summary.activityCount}</strong>
        </div>
        <div className={styles.summaryItem}>
          <p className={styles.summaryLabel}>Người tham gia</p>
          <strong>{summary.totalAttendance.toLocaleString('vi-VN')}</strong>
        </div>
        <div className={styles.summaryItem}>
          <p className={styles.summaryLabel}>Tỷ lệ tham gia</p>
          <strong className={getRateClass(summary.attendanceRate)}>
            {summary.attendanceRate}%
          </strong>
        </div>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>MÃ SỰ KIỆN</th>
              <th>TÊN SỰ KIỆN</th>
              <th>LOẠI SỰ KIỆN</th>
              <th>TRẠNG THÁI</th>
              <th>
                <div className={styles.dateHead}>
                  NGÀY
                  <button
                    className={styles.sortBtn}
                    onClick={() => setDateSort(dateSort === 'nearest' ? 'farthest' : 'nearest')}
                    title="Sắp xếp ngày"
                  >
                    {dateSort === 'nearest' ? '↑' : '↓'}
                  </button>
                </div>
              </th>
              <th>THAM DỰ</th>
              <th>TỶ LỆ</th>
              <th>CẬP NHẬT</th>
              <th>THAO TÁC</th>
              <th>DANH SÁCH ĐĂNG KÝ</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const status = statusLabels[event.status] || statusLabels.upcoming;
              const tag = tagLabels[event.tag] || tagLabels.OTHER;
              const date = new Date(event.date);
              const percent = event.capacity > 0
                ? Math.round((event.attendance / event.capacity) * 100)
                : 0;
              const isCompleted = event.status === 'completed';
              const hasEvaluation = evaluations.some((item) => item.eventCode === event.eventCode);
              const statusAction = STATUS_ACTIONS[event.status];

              return (
                <tr key={event.id} className={styles.row}>
                  <td className={styles.codeCell}>{event.eventCode}</td>
                  <td>
                    <p className={styles.eventName}>{event.title}</p>
                    <p className={styles.eventLocation}>{event.location} · {event.time} - {event.endTime}</p>
                  </td>
                  <td>
                    <span className={styles.tagBadge} style={{ background: tag.bg, color: tag.color }}>
                      {tag.label}
                    </span>
                  </td>
                  <td>
                    <span className={styles.statusBadge} style={{ background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <span className={styles.attendance}>{event.attendance} / {event.capacity}</span>
                  <div className={styles.attBar}>
                    <div className={styles.attBarFill} style={{ width: `${percent}%` }} />
                  </div>
                </td>
                <td>
                    <span className={`${styles.rateBadge} ${getRateClass(percent)}`}>
                      {percent}%
                    </span>
                  </td>
                  <td>
                    {statusAction && (
                      <button
                        className={styles.statusActionBtn}
                        onClick={() => onUpdateStatus(event.id, statusAction.nextStatus)}
                      >
                        {statusAction.label}
                      </button>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => onEdit(event)} title="Chỉnh sửa">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    {isCompleted && (
                      <button
                        className={hasEvaluation ? styles.viewEvaluationBtn : styles.evaluateBtn}
                        onClick={() => onEvaluate(event)}
                        title={hasEvaluation ? 'Xem đánh giá' : 'Đánh giá'}
                      >
                        {hasEvaluation ? (
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11l3 3L22 4"/>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                          </svg>
                        )}
                      </button>
                    )}
                    <button className={styles.deleteBtn} onClick={() => onDelete(event)} title="Xoá">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
                      </svg>
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    className={styles.registrationsBtn}
                    onClick={() => onViewRegistrations(event)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span className={styles.paginationInfo}>{filteredCount} sự kiện</span>
        <div className={styles.paginationBtns}>
          <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`${styles.pageBtn} ${pageNumber === page ? styles.pageBtnActive : ''}`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
        </div>
      </div>
    </div>
  );
}
