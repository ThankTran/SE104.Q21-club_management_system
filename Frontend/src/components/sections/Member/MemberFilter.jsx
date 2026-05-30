import styles from './MemberFilter.module.css';

import { useEffect, useRef } from 'react';

export default function MemberFilter({
  open,
  setOpen,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  departments,
  statuses,
  roles,
  showStatus = true,
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [open, setOpen]);

  const handleReset = () => {
    setDepartmentFilter('');
    setStatusFilter('');
    setRoleFilter('');
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button className={styles.filterBtn} onClick={() => setOpen(!open)} type="button">
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>
        Bộ lọc
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.group}>
            <label>Khoa</label>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option value="">Tất cả khoa</option>
              {departments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          {showStatus && (
            <div className={styles.group}>
              <label>Trạng thái hồ sơ</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          )}

          <div className={styles.group}>
            <label>Vai trò</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">Tất cả vai trò</option>
              {roles.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className={styles.actions}>
            <button className={styles.resetBtn} onClick={handleReset} type="button">Đặt lại</button>
            <button className={styles.applyBtn} onClick={() => setOpen(false)} type="button">Áp dụng</button>
          </div>
        </div>
      )}
    </div>
  );
}
