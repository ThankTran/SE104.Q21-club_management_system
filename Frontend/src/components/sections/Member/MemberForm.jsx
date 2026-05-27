import { useEffect, useMemo, useState } from 'react';
import styles from './MemberForm.module.css';

export const DEPARTMENTS = [
  'Khoa Công nghệ phần mềm',
  'Khoa Hệ thống thông tin',
  'Khoa Khoa học máy tính',
  'Khoa Kỹ thuật máy tính',
  'Khoa Mạng máy tính & Truyền thông',
  'Khoa Khoa học & Kỹ thuật thông tin',
];

export const ROLES = [
  'Chủ nhiệm',
  'Phó chủ nhiệm',
  'Trưởng ban học thuật',
  'Trưởng ban truyền thông',
  'Thành viên',
];

export const GRADUATION_STATUSES = ['Chưa tốt nghiệp', 'Đã tốt nghiệp'];
export const GENDERS = ['Nam', 'Nữ'];

const EMPTY_FORM = {
  id: '',
  name: '',
  email: '',
  department: '',
  dateOfBirth: '',
  gender: '',
  graduationStatus: 'Chưa tốt nghiệp',
  role: 'Thành viên',
  phone: '',
};

export default function MemberForm({
  open,
  onClose,
  onSubmit,
  initial = null,
  loading = false,
  existingMembers = [],
  departments = DEPARTMENTS,
  roles = ROLES,
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const existingLookup = useMemo(() => {
    const currentId = initial?.id || '';
    return existingMembers.filter((m) => m.id !== currentId);
  }, [existingMembers, initial]);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, initial]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const validate = () => {
    const errs = {};
    const studentId = form.id.trim();
    const email = form.email.trim().toLowerCase();

    if (!studentId) errs.id = 'Vui lòng nhập MSSV';
    else if (!/^\d{6,12}$/.test(studentId)) errs.id = 'MSSV phải là dãy số hợp lệ';
    else if (existingLookup.some((m) => m.id === studentId)) errs.id = 'MSSV đã tồn tại';

    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên';
    if (!email) errs.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email không hợp lệ';
    else if (existingLookup.some((m) => m.email?.toLowerCase() === email)) errs.email = 'Email đã tồn tại';

    if (!form.department) errs.department = 'Vui lòng chọn khoa';
    if (!form.dateOfBirth) errs.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!GENDERS.includes(form.gender)) errs.gender = 'Giới tính chỉ được là Nam hoặc Nữ';
    if (!GRADUATION_STATUSES.includes(form.graduationStatus)) {
      errs.graduationStatus = 'Tình trạng tốt nghiệp không hợp lệ';
    } else if (form.graduationStatus !== 'Chưa tốt nghiệp') {
      errs.graduationStatus = 'Thành viên phải là sinh viên chưa tốt nghiệp';
    }
    if (!form.role) errs.role = 'Vui lòng chọn vai trò';
    else if (!roles.includes(form.role)) errs.role = 'Vai trò không hợp lệ';

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    onSubmit({
      ...form,
      id: form.id.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {isEdit ? 'Chỉnh sửa hồ sơ thành viên' : 'Tạo phiếu đăng ký thành viên'}
            </h2>
            <p className={styles.subtitle}>
              Hồ sơ cần đủ thông tin sinh viên trước khi đưa vào luồng xét duyệt.
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Đóng">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.sectionTitle}>Thông tin hồ sơ</div>
          <div className={styles.row2}>
            <Field label="MSSV *" error={errors.id}>
              <input className={`${styles.input} ${errors.id ? styles.inputError : ''}`} value={form.id} onChange={handleChange('id')} placeholder="2410001" disabled={isEdit} />
            </Field>
            <Field label="Họ và tên *" error={errors.name}>
              <input className={`${styles.input} ${errors.name ? styles.inputError : ''}`} value={form.name} onChange={handleChange('name')} placeholder="Nguyễn Văn A" />
            </Field>
          </div>

          <div className={styles.row2}>
            <Field label="Email *" error={errors.email}>
              <input className={`${styles.input} ${errors.email ? styles.inputError : ''}`} type="email" value={form.email} onChange={handleChange('email')} placeholder="example@student.edu.vn" />
            </Field>
            <Field label="Số điện thoại">
              <input className={styles.input} type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="0912 345 678" />
            </Field>
          </div>

          <div className={styles.row2}>
            <Field label="Ngày sinh *" error={errors.dateOfBirth}>
              <input className={`${styles.input} ${errors.dateOfBirth ? styles.inputError : ''}`} type="date" value={form.dateOfBirth} onChange={handleChange('dateOfBirth')} />
            </Field>
            <Field label="Giới tính *" error={errors.gender}>
              <select className={`${styles.select} ${errors.gender ? styles.inputError : ''}`} value={form.gender} onChange={handleChange('gender')}>
                <option value="">-- Chọn giới tính --</option>
                {GENDERS.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Khoa *" error={errors.department}>
            <select className={`${styles.select} ${errors.department ? styles.inputError : ''}`} value={form.department} onChange={handleChange('department')}>
              <option value="">-- Chọn khoa --</option>
              {departments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>

          <div className={styles.sectionTitle}>Phân quyền</div>
          <div className={styles.row2}>
            <Field label="Vai trò *" error={errors.role}>
              <select className={`${styles.select} ${errors.role ? styles.inputError : ''}`} value={form.role} onChange={handleChange('role')}>
                {roles.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Tình trạng tốt nghiệp *" error={errors.graduationStatus}>
              <select className={`${styles.select} ${errors.graduationStatus ? styles.inputError : ''}`} value={form.graduationStatus} onChange={handleChange('graduationStatus')}>
                {GRADUATION_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Hủy</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo hồ sơ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  const labelContent = typeof label === 'string' && label.trimEnd().endsWith('*')
    ? (
      <>
        {label.replace(/\s*\*$/, '')} <span className={styles.required}>*</span>
      </>
    )
    : label;

  return (
    <div className={styles.field}>
      <label className={styles.label}>{labelContent}</label>
      {children}
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
