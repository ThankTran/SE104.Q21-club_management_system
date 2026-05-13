import styles from './EventFilter.module.css';

export default function EventFilter({
  open,
  setOpen,
  statusFilter,
  setStatusFilter,
  tagFilter,
  setTagFilter,
  statuses,
  tags,
}) {
  const handleReset = () => {
    setStatusFilter('all');
    setTagFilter('all');
  };

  return (
    <div className={styles.wrap}>
      <button
        className={styles.filterBtn}
        onClick={() => setOpen(!open)}
      >
        <svg
          width="15"
          height="15"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>

        Bộ lọc
      </button>

      {open && (
        <div className={styles.dropdown}>
          {/* STATUS */}
          <div className={styles.group}>
            <label>Trạng thái</label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                Tất cả
              </option>

              {Object.entries(statuses).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          {/* TAG */}
          <div className={styles.group}>
            <label>Thẻ</label>

            <select
              value={tagFilter}
              onChange={(e) =>
                setTagFilter(e.target.value)
              }
            >
              <option value="all">
                Tất cả
              </option>

              {tags.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.resetBtn}
              onClick={handleReset}
            >
              Reset
            </button>

            <button
              className={styles.applyBtn}
              onClick={() => setOpen(false)}
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}