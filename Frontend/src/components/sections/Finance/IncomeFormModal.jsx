import { useState, useEffect } from 'react';
import styles from '../../../pages/Finance/FinancePage.module.css';
import Field from '../Finance/FormField';
import { EMPTY_THU, HINH_THUC_OPTIONS } from '../Finance/financeConstants';

import { toInputDate } from '../../../utils/Finance/financeUtils';

export default function IncomeFormModal({ open, onClose, onSubmit, initial, loading }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY_THU);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        initial 
        ? { 
          ...EMPTY_THU, 
          ...initial, 
          soTien: initial.soTien || '', 
          maSuKien: initial.maSuKien || '' ,
          ngayThu: toInputDate(initial.ngayThu),
        } 
        : EMPTY_THU
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
    if (!form.nguoiNop.trim())  errs.nguoiNop  = 'Vui lòng nhập người nộp tiền';
    if (!form.lyDo.trim())      errs.lyDo      = 'Vui lòng nhập lý do';
    if (!form.hinhThuc)         errs.hinhThuc  = 'Vui lòng chọn hình thức';
    if (!form.ngayThu)          errs.ngayThu   = 'Vui lòng nhập ngày thu';
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
            <h2 className={styles.modalTitle}>{isEdit ? 'Chỉnh sửa phiếu thu' : 'Lập phiếu thu tiền'}</h2>
            <p className={styles.modalSub}>Phiếu Thu Tiền</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.formMeta}>
          <span className={styles.metaTag}>📋 Phiếu Thu Tiền · {new Date().toLocaleDateString('vi-VN')}</span>
          <span className={styles.metaRule}>Mức đóng quỹ chuẩn 75.000₫/tháng</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row2}>
            <Field
              label={
                <>
                  Người nộp tiền <span className={styles.required}>*</span>
                </>
              }
              error={errors.nguoiNop}
            >              
            <input className={`${styles.input} ${errors.nguoiNop ? styles.inputErr : ''}`}
                placeholder="Họ và tên" value={form.nguoiNop} onChange={set('nguoiNop')} />
            </Field>
            <Field 
              label={
                  <>
                    Hình thức <span className={styles.required}>*</span>
                  </>
                }
                error={errors.hinhThuc}
              >
              <select className={`${styles.select} ${errors.hinhThuc ? styles.inputErr : ''}`}
                value={form.hinhThuc} onChange={set('hinhThuc')}>
                <option value="">-- Chọn --</option>
                {HINH_THUC_OPTIONS.map(h => <option key={h}>{h}</option>)}
              </select>
            </Field>
          </div>
          <Field 
            label={
              <>
                Lý do <span className={styles.required}>*</span>
              </>
            }
            error={errors.lyDo}
          >
            <input className={`${styles.input} ${errors.lyDo ? styles.inputErr : ''}`}
              placeholder="VD: Đóng quỹ tháng 1, Phí tham gia sự kiện..." value={form.lyDo} onChange={set('lyDo')} />
          </Field>
          <div className={styles.row2}>
            <Field 
              label={
                <>
                  Ngày thu <span className={styles.required}>*</span>
                </>
              }
              error={errors.ngayThu}
            >
              <input type="date" className={`${styles.input} ${errors.ngayThu ? styles.inputErr : ''}`}
                value={form.ngayThu} onChange={set('ngayThu')} />
            </Field>
            <Field 
              label={
                <>
                  Số tiền (₫) <span className={styles.required}>*</span>
                </>
              }
              error={errors.soTien}
            >
              <input type="number" className={`${styles.input} ${errors.soTien ? styles.inputErr : ''}`}
                placeholder="75000" min="1" value={form.soTien} onChange={set('soTien')} />
            </Field>
          </div>
          <Field 
            label={
              <>
                Mã sự kiện (nếu có)
              </>
            }
          >
            <input className={styles.input} placeholder="VD: SK001" value={form.maSuKien} onChange={set('maSuKien')} />
          </Field>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Huỷ</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo phiếu thu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
