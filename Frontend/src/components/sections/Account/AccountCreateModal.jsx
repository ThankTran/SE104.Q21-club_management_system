import { useEffect, useMemo, useState } from "react";
import styles from "./AccountCreateModal.module.css";

const EMPTY_FORM = {
  memberId: "",
  password: "",
};

export default function AccountCreateModal({
  open,
  onClose,
  onSubmit,
  existingAccounts = [],
  members = [],
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const availableMembers = useMemo(() => {
    const usedMemberIds = new Set(
      existingAccounts
        .map((account) => String(account.memberDbId || ""))
        .filter(Boolean),
    );

    return members.filter((member) => {
      const memberId = String(member.memberId || "");
      return memberId && !usedMemberIds.has(memberId);
    });
  }, [existingAccounts, members]);

  useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY_FORM,
        memberId: availableMembers[0]?.memberId ? String(availableMembers[0].memberId) : "",
      });
      setErrors({});
    }
  }, [availableMembers, open]);

  if (!open) return null;

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form, existingAccounts);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    const submitted = await onSubmit({
      memberId: form.memberId.trim(),
      password: form.password.trim(),
    });

    if (submitted !== false) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Tạo tài khoản</h2>
            <p className={styles.subtitle}>
              Chọn memberId làm tên đăng nhập và đặt mật khẩu ban đầu.
            </p>
          </div>
          <button className={styles.closeBtn} type="button" onClick={onClose} aria-label="Đóng">
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Field label="Member ID" error={errors.memberId}>
            <select
              className={styles.select}
              value={form.memberId}
              onChange={handleChange("memberId")}
              disabled={!availableMembers.length}
            >
              {availableMembers.length ? (
                availableMembers.map((member) => (
                  <option key={member.memberId} value={member.memberId}>
                    {member.memberId}
                    {member.id ? ` - ${member.id}` : ""}
                    {member.name ? ` - ${member.name}` : ""}
                  </option>
                ))
              ) : (
                <option value="">Không còn memberId khả dụng</option>
              )}
            </select>
          </Field>

          <Field label="Mật khẩu" error={errors.password}>
            <input
              className={styles.input}
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Nhập mật khẩu"
            />
          </Field>

          <div className={styles.actions}>
            <button className={styles.cancelBtn} type="button" onClick={onClose}>Hủy</button>
            <button className={styles.submitBtn} type="submit" disabled={!availableMembers.length}>
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}

function validate(form, existingAccounts) {
  const errors = {};
  const memberId = form.memberId.trim();

  if (!memberId) {
    errors.memberId = "Vui lòng chọn memberId";
  } else if (existingAccounts.some((account) => String(account.memberDbId || "") === memberId)) {
    errors.memberId = "MemberId đã có tài khoản";
  }

  if (!form.password.trim()) {
    errors.password = "Vui lòng nhập mật khẩu";
  }

  return errors;
}
