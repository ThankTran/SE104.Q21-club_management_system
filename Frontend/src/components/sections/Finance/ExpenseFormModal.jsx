import { useState, useEffect } from 'react';
import styles from '../../../pages/Finance/FinancePage.module.css';
import Field from '../Finance/FormField';
import { EMPTY_CHI } from '../Finance/financeConstants';

export default function PhieuChiModal({ open, onClose, onSubmit, initial, loading }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY_CHI);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? { ...EMPTY_CHI, ...initial, soTien: initial.soTien || '' }
          : EMPTY_CHI
      );
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nguoiNhan.trim()) errs.nguoiNhan = 'Vui lòng nhập người nhận tiền';
    if (!form.noiDung.trim())   errs.noiDung   = 'Vui lòng nhập nội dung chi';
    if (!form.ngayLap)          errs.ngayLap   = 'Vui lòng nhập ngày lập';
    if (!form.soTien || Number(form.soTien) <= 0) errs.soTien = 'Số tiền phải lớn hơn 0';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, soTien: Number(form.soTien) });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>{isEdit ? 'Chỉnh sửa phiếu chi' : 'Lập phiếu chi tiền'}</h2>
            <p className={styles.modalSub}>Phiếu Chi Tiền</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.formMeta}>
          <span className={styles.metaTag}>📋 Phiếu Chi Tiền · {new Date().toLocaleDateString('vi-VN')}</span>
          <span className={styles.metaRule}>Mã sự kiện phải hợp lệ nếu nhập</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row2}>
            <Field label="Người nhận tiền *" error={errors.nguoiNhan}>
              <input className={`${styles.input} ${errors.nguoiNhan ? styles.inputErr : ''}`}
                placeholder="Họ tên / Ban / Nhóm" value={form.nguoiNhan} onChange={set('nguoiNhan')} />
            </Field>
            <Field label="Mã sự kiện" error={errors.maSuKien}>
              <input className={`${styles.input} ${errors.maSuKien ? styles.inputErr : ''}`}
                placeholder="VD: SK001 (bỏ trống nếu không có)" value={form.maSuKien} onChange={set('maSuKien')} />
            </Field>
          </div>
          <Field label="Nội dung chi *" error={errors.noiDung}>
            <input className={`${styles.input} ${errors.noiDung ? styles.inputErr : ''}`}
              placeholder="VD: Thuê hội trường, in ấn tài liệu..." value={form.noiDung} onChange={set('noiDung')} />
          </Field>
          <div className={styles.row2}>
            <Field label="Ngày lập *" error={errors.ngayLap}>
              <input type="date" className={`${styles.input} ${errors.ngayLap ? styles.inputErr : ''}`}
                value={form.ngayLap} onChange={set('ngayLap')} />
            </Field>
            <Field label="Số tiền (₫) *" error={errors.soTien}>
              <input type="number" className={`${styles.input} ${errors.soTien ? styles.inputErr : ''}`}
                placeholder="100000" min="1" value={form.soTien} onChange={set('soTien')} />
            </Field>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Huỷ</button>
            <button type="submit" className={`${styles.submitBtn} ${styles.chiBtn}`} disabled={loading}>
              {loading ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo phiếu chi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
