import { useState, useEffect } from 'react';
import styles from './MemberForm.module.css';

const DEPARTMENTS = [
  'Astrophysics', 'Data Science', 'Molecular Biology',
  'Quantum Physics', 'Computer Science', 'Biochemistry',
  'Mathematics', 'Physics', 'Chemistry',
];

const ROLES = ['Head of Research', 'Senior Fellow', 'Researcher', 'Admin'];

const STATUSES = ['Active', 'On Leave', 'Inactive'];

const EMPTY_FORM = {
  name: '',
  email: '',
  department: '',
  role: '',
  status: 'Active',
  phone: '',
  joinDate: '',
};

/**
 * Props:
 *   open       – boolean
 *   onClose    – () => void
 *   onSubmit   – (formData) => void
 *   initial    – member object (edit mode) or null (add mode)
 *   loading    – boolean (submit in progress)
 */
export default function MemberForm({ open, onClose, onSubmit, initial = null, loading = false }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, initial]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim())       errs.name       = 'Vui lòng nhập họ tên';
    if (!form.email.trim())      errs.email      = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                 errs.email      = 'Email không hợp lệ';
    if (!form.department)        errs.department = 'Vui lòng chọn bộ môn';
    if (!form.role)              errs.role       = 'Vui lòng chọn vai trò';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {isEdit ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
            </h2>
            <p className={styles.subtitle}>
              {isEdit
                ? 'Cập nhật thông tin thành viên trong hệ thống'
                : 'Điền thông tin để thêm thành viên vào hệ thống'}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Row 1: Name + Email */}
          <div className={styles.row2}>
            <Field label="Họ và tên *" error={errors.name}>
              <input
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                type="text"
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={handleChange('name')}
              />
            </Field>
            <Field label="Email *" error={errors.email}>
              <input
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                type="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange('email')}
              />
            </Field>
          </div>

          {/* Row 2: Department + Role */}
          <div className={styles.row2}>
            <Field label="Bộ môn *" error={errors.department}>
              <select
                className={`${styles.select} ${errors.department ? styles.inputError : ''}`}
                value={form.department}
                onChange={handleChange('department')}
              >
                <option value="">-- Chọn bộ môn --</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field label="Vai trò *" error={errors.role}>
              <select
                className={`${styles.select} ${errors.role ? styles.inputError : ''}`}
                value={form.role}
                onChange={handleChange('role')}
              >
                <option value="">-- Chọn vai trò --</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Row 3: Status + Phone */}
          <div className={styles.row2}>
            <Field label="Trạng thái" error={errors.status}>
              <div className={styles.statusGroup}>
                {STATUSES.map((s) => (
                  <label key={s} className={`${styles.statusOption} ${form.status === s ? styles.statusSelected : ''}`}>
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={form.status === s}
                      onChange={handleChange('status')}
                      className={styles.radioHidden}
                    />
                    <span className={styles.statusDot} data-status={s} />
                    {s}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Số điện thoại" error={errors.phone}>
              <input
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                type="tel"
                placeholder="0912 345 678"
                value={form.phone}
                onChange={handleChange('phone')}
              />
            </Field>
          </div>

          {/* Row 4: Join date */}
          <Field label="Ngày gia nhập">
            <input
              className={styles.input}
              type="date"
              value={form.joinDate}
              onChange={handleChange('joinDate')}
            />
          </Field>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? 'Đang lưu...'
                : isEdit ? 'Lưu thay đổi' : 'Thêm thành viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Field wrapper ────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}