import { useState, useEffect } from 'react';
import styles from './IncomeFormModal.module.css';
import Field from '../Finance/FormField';
import { EMPTY_THU, HINH_THUC_OPTIONS } from '../Finance/financeConstants';

import { toInputDate } from '../../../utils/Finance/financeUtils';

export default function IncomeFormModal({ open, onClose, onSubmit, initial, loading, memberOptions = [] }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY_THU);
  const [errors, setErrors] = useState({});
  const [memberSearch, setMemberSearch] = useState('');
  const selectedMembers = getSelectedMembers(form.memberIds || [], memberOptions);
  const filteredMemberOptions = filterMembers(memberOptions, memberSearch);
  const isTransfer = !isEdit && form.hinhThuc === 'Chuyển khoản';

  useEffect(() => {
    if (open) {
      setForm(
        initial 
        ? { 
          ...EMPTY_THU, 
          ...initial, 
          soTien: initial.soTien || '', 
          maSuKien: initial.maSuKien || '' ,
          memberId: initial.memberId || initial.raw?.memberId || '',
          ngayThu: toInputDate(initial.ngayThu),
        } 
        : { ...EMPTY_THU, memberIds: [] }
      );
      setMemberSearch('');
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const toggleMember = (memberId) => {
    const id = String(memberId);
    const currentIds = (form.memberIds || []).map((value) => String(value));
    const memberIds = currentIds.includes(id)
      ? currentIds.filter((value) => value !== id)
      : [...currentIds, id];
    updateSelectedMembers(memberIds);
  };

  const toggleAllMembers = () => {
    const allIds = memberOptions.map((member) => String(member.memberId));
    const currentIds = (form.memberIds || []).map((value) => String(value));
    const memberIds = currentIds.length === allIds.length ? [] : allIds;
    updateSelectedMembers(memberIds);
  };

  const updateSelectedMembers = (memberIds) => {
    const names = memberOptions
      .filter((member) => memberIds.includes(String(member.memberId)))
      .map((member) => member.name);

    setForm((current) => ({
      ...current,
      memberIds,
      memberId: memberIds[0] || '',
      nguoiNop: names.join('\n'),
    }));
    setErrors((current) => ({ ...current, nguoiNop: '', memberIds: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!parsePayers(form.nguoiNop).length)  errs.nguoiNop  = isEdit ? 'Vui lòng nhập người nộp tiền' : 'Vui lòng chọn ít nhất một thành viên';
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
    const payers = parsePayers(form.nguoiNop);
    if (isTransfer) {
      onSubmit(payers.map((nguoiNop) => {
        const member = resolveMember(nguoiNop, memberOptions);
        return {
          ...form,
          mode: 'transfer',
          nguoiNop: member?.name || nguoiNop,
          memberId: member?.memberId || form.memberId || null,
          soTien: Number(form.soTien),
        };
      }));
      return;
    }
    if (isEdit) {
      onSubmit({ ...form, nguoiNop: payers[0], soTien: Number(form.soTien) });
      return;
    }
    onSubmit(payers.map((nguoiNop) => {
      const member = resolveMember(nguoiNop, memberOptions);
      return {
        ...form,
        nguoiNop: member?.name || nguoiNop,
        memberId: member?.memberId || form.memberId || null,
        soTien: Number(form.soTien),
      };
    }));
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
          <span className={styles.metaRule}>
            {isTransfer ? 'Tạo mã QR và chờ thành viên đóng qua trang Đóng quỹ' : 'Mức đóng quỹ chuẩn 75.000₫/tháng'}
          </span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
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

          <div className={styles.singleRow}>
            <Field
              label={
                <>
                  {isEdit ? 'Người nộp tiền' : 'Chọn thành viên'} <span className={styles.required}>*</span>
                </>
              }
              error={errors.nguoiNop}
            >
              {isEdit ? (
                <input className={`${styles.input} ${errors.nguoiNop ? styles.inputErr : ''}`}
                  placeholder="Họ và tên" value={form.nguoiNop} onChange={set('nguoiNop')} />
              ) : (
                <>
                  <div className={styles.memberSearchWrap}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                      className={styles.memberSearchInput}
                      value={memberSearch}
                      onChange={(event) => setMemberSearch(event.target.value)}
                      placeholder="Tìm theo tên hoặc MSSV..."
                    />
                    {memberSearch && (
                      <button type="button" className={styles.clearMemberSearch} onClick={() => setMemberSearch('')}>
                        ×
                      </button>
                    )}
                  </div>
                  <div className={`${styles.memberSelectBox} ${errors.nguoiNop || errors.memberIds ? styles.inputErr : ''}`}>
                    <button
                      type="button"
                      className={`${styles.memberOption} ${selectedMembers.length === memberOptions.length && memberOptions.length > 0 ? styles.memberOptionActive : ''}`}
                      onClick={toggleAllMembers}
                    >
                      <span className={styles.optionCheck}>
                        {selectedMembers.length === memberOptions.length && memberOptions.length > 0 ? '✓' : ''}
                      </span>
                      <span>Tất cả thành viên</span>
                    </button>
                    {filteredMemberOptions.map((member) => {
                      const checked = (form.memberIds || []).map((value) => String(value)).includes(String(member.memberId));
                      return (
                        <button
                          type="button"
                          key={member.memberId || member.id}
                          className={`${styles.memberOption} ${checked ? styles.memberOptionActive : ''}`}
                          onClick={() => toggleMember(member.memberId)}
                        >
                          <span className={styles.optionCheck}>{checked ? '✓' : ''}</span>
                          <span>{member.name} {member.id ? `(${member.id})` : ''}</span>
                        </button>
                      );
                    })}
                    {filteredMemberOptions.length === 0 && (
                      <div className={styles.memberEmpty}>Không tìm thấy thành viên phù hợp.</div>
                    )}
                  </div>
                  <p className={styles.fieldHint}>
                    {isTransfer
                      ? 'Mỗi thành viên được chọn sẽ có một mã QR riêng. Chọn "Tất cả thành viên" để tạo cho toàn bộ danh sách.'
                      : 'Mỗi thành viên được chọn sẽ tạo một phiếu thu riêng với cùng lý do, ngày thu và số tiền.'}
                  </p>
                </>
              )}
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

          {isTransfer && (
            <div className={styles.qrPreview}>
              <div className={styles.fakeQr} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className={styles.qrInfo}>
                <p className={styles.qrTitle}>QR chuyển khoản sẽ được tạo</p>
                <p className={styles.qrLine}>Nội dung: CLB THMN - {form.maSuKien || 'QUY'} - mã thành viên tự động</p>
                <p className={styles.qrLine}>Số tiền: {Number(form.soTien || 0).toLocaleString('vi-VN')}₫</p>
                <p className={styles.fieldHint}>
                  Sau khi tạo, từng member trong danh sách sẽ có một khoản ở trang Đóng quỹ với trạng thái chờ đóng.
                </p>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Huỷ</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? 'Đang lưu...'
                : isEdit
                  ? 'Lưu thay đổi'
                  : isTransfer
                    ? `Tạo ${Math.max(parsePayers(form.nguoiNop).length, 1)} mã QR`
                    : `Tạo ${Math.max(parsePayers(form.nguoiNop).length, 1)} phiếu thu`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function parsePayers(value) {
  return value
    .split(/\r?\n|,/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function resolveMember(value, memberOptions) {
  const keyword = normalizeLookup(value);
  if (!keyword) return null;

  return memberOptions.find((member) => {
    const memberId = String(member.memberId || '');
    const studentId = normalizeLookup(member.id || '');
    const name = normalizeLookup(member.name || '');
    const email = normalizeLookup(member.email || '');
    return (
      memberId === keyword ||
      studentId === keyword ||
      name === keyword ||
      email === keyword
    );
  }) || null;
}

function getSelectedMembers(memberIds, memberOptions) {
  const idSet = new Set((memberIds || []).map((id) => String(id)));
  return memberOptions.filter((member) => idSet.has(String(member.memberId)));
}

function filterMembers(memberOptions, query) {
  const keyword = normalizeLookup(query);
  if (!keyword) return memberOptions;

  return memberOptions.filter((member) => {
    const name = normalizeLookup(member.name || '');
    const studentId = normalizeLookup(member.id || '');
    return name.includes(keyword) || studentId.includes(keyword);
  });
}

function normalizeLookup(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}
