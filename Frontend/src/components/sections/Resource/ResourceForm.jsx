import { useState, useEffect } from 'react';
import styles from './ResourceForm.module.css';

const TYPES   = ['Giáo trình', 'Slide bài giảng', 'Tài liệu tham khảo', 'Khác'];
const FORMATS = ['PDF', 'DOCX', 'PPT', 'Khác'];
const SOURCES = ['Tự biên soạn', 'Internet', 'Giảng viên cung cấp', 'Khác'];

const EMPTY_FORM = {
  title:       '',
  type:        '',
  subject:     '',
  format:      '',
  source:      '',
  description: '',
  link:        '',
};

/**
 * Props:
 *   open     – boolean
 *   onClose  – () => void
 *   onSubmit – (formData) => void
 *   initial  – resource object (edit) | null (add)
 *   loading  – boolean
 *   isAdmin  – boolean  (admin thêm trực tiếp, không qua duyệt)
 */
export default function ResourceForm({
  open,
  onClose,
  onSubmit,
  initial = null,
  loading = false,
  isAdmin = false,
}) {
  const isEdit = !!initial;

  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, initial]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())   errs.title   = 'Vui lòng nhập tên tài liệu';
    if (!form.subject.trim()) errs.subject = 'Vui lòng nhập môn học / chủ đề';
    if (!form.type)           errs.type    = 'Vui lòng chọn loại tài liệu';
    if (!form.format)         errs.format  = 'Vui lòng chọn định dạng';
    if (!form.link.trim())    errs.link    = 'Vui lòng nhập đường dẫn tài liệu';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {isEdit ? 'Chỉnh sửa tài liệu' : isAdmin ? 'Thêm tài liệu mới' : 'Đề xuất thêm tài liệu'}
            </h2>
            <p className={styles.subtitle}>
              {isEdit
                ? 'Cập nhật thông tin tài liệu trong hệ thống'
                : isAdmin
                  ? 'Thêm tài liệu trực tiếp vào kho học thuật'
                  : 'Tài liệu sẽ được admin xét duyệt trước khi hiển thị'}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Mã phiếu + Ngày lập */}
        <div className={styles.formMeta}>
          <span className={styles.formMetaTag}>
            📋 Phiếu thêm tài liệu học thuật
          </span>
          <span className={styles.formMetaDate}>
            Ngày lập: {new Date().toLocaleDateString('vi-VN')}
          </span>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* Section I: Thông tin tài liệu */}
          <p className={styles.sectionLabel}>II. Thông tin tài liệu</p>

          {/* Tên tài liệu */}
          <Field label="Tên tài liệu *" error={errors.title}>
            <input
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              type="text"
              placeholder="VD: Giáo trình Lập trình hướng đối tượng"
              value={form.title}
              onChange={handleChange('title')}
            />
          </Field>

          {/* Loại + Định dạng */}
          <div className={styles.row2}>
            <Field label="Loại tài liệu *" error={errors.type}>
              <div className={styles.radioGroup}>
                {TYPES.map((t) => (
                  <label
                    key={t}
                    className={`${styles.radioBtn} ${form.type === t ? styles.radioBtnActive : ''}`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={form.type === t}
                      onChange={handleChange('type')}
                      className={styles.radioHidden}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Định dạng *" error={errors.format}>
              <div className={styles.radioGroup}>
                {FORMATS.map((f) => (
                  <label
                    key={f}
                    className={`${styles.radioBtn} ${form.format === f ? styles.radioBtnActive : ''}`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={f}
                      checked={form.format === f}
                      onChange={handleChange('format')}
                      className={styles.radioHidden}
                    />
                    {f}
                  </label>
                ))}
              </div>
            </Field>
          </div>

          {/* Môn học / Chủ đề */}
          <Field label="Môn học / Chủ đề *" error={errors.subject}>
            <input
              className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
              type="text"
              placeholder="VD: Lập trình hướng đối tượng, Cơ sở dữ liệu..."
              value={form.subject}
              onChange={handleChange('subject')}
            />
          </Field>

          {/* Nguồn tài liệu */}
          <Field label="Nguồn tài liệu">
            <div className={styles.radioGroup}>
              {SOURCES.map((s) => (
                <label
                  key={s}
                  className={`${styles.radioBtn} ${form.source === s ? styles.radioBtnActive : ''}`}
                >
                  <input
                    type="radio"
                    name="source"
                    value={s}
                    checked={form.source === s}
                    onChange={handleChange('source')}
                    className={styles.radioHidden}
                  />
                  {s}
                </label>
              ))}
            </div>
          </Field>

          {/* Mô tả ngắn */}
          <Field label="Mô tả ngắn nội dung tài liệu">
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="Mô tả ngắn về nội dung và phạm vi của tài liệu..."
              value={form.description}
              onChange={handleChange('description')}
            />
          </Field>

          {/* Section III: Đường dẫn */}
          <p className={styles.sectionLabel}>III. Đường dẫn / tệp đính kèm</p>

          <Field label="Link lưu trữ *" error={errors.link}>
            <input
              className={`${styles.input} ${errors.link ? styles.inputError : ''}`}
              type="url"
              placeholder="https://drive.google.com/..."
              value={form.link}
              onChange={handleChange('link')}
            />
          </Field>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Huỷ
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? 'Đang lưu...'
                : isEdit
                  ? 'Lưu thay đổi'
                  : isAdmin ? 'Thêm tài liệu' : 'Gửi đề xuất'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Field wrapper
function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
