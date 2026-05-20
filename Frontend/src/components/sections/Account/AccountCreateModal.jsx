import { useEffect, useState } from "react";
import { DEPARTMENTS, ROLES } from "../Member/MemberForm";
import styles from "./AccountCreateModal.module.css";

const EMPTY_FORM = {
  memberId: "",
  name: "",
  email: "",
  department: DEPARTMENTS[0],
  role: ROLES[4],
  username: "",
  password: "",
};

export default function AccountCreateModal({ open, onClose, onSubmit, existingAccounts = [] }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "email" && !current.username) {
        next.username = value.split("@")[0];
      }
      return next;
    });
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form, existingAccounts);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    onSubmit({
      ...form,
      memberId: form.memberId.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password.trim(),
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Tạo tài khoản</h2>
            <p className={styles.subtitle}>Thêm tài khoản đăng nhập cho thành viên câu lạc bộ.</p>
          </div>
          <button className={styles.closeBtn} type="button" onClick={onClose} aria-label="Đóng">
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row2}>
            <Field label="MSSV" error={errors.memberId}>
              <input className={styles.input} value={form.memberId} onChange={handleChange("memberId")} placeholder="2410015" />
            </Field>
            <Field label="Họ và tên" error={errors.name}>
              <input className={styles.input} value={form.name} onChange={handleChange("name")} placeholder="Nguyễn Văn A" />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input className={styles.input} value={form.email} onChange={handleChange("email")} placeholder="example@student.edu.vn" />
          </Field>

          <div className={styles.row2}>
            <Field label="Khoa">
              <select className={styles.select} value={form.department} onChange={handleChange("department")}>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </Field>
            <Field label="Vai trò">
              <select className={styles.select} value={form.role} onChange={handleChange("role")}>
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className={styles.row2}>
            <Field label="Tên đăng nhập" error={errors.username}>
              <input className={styles.input} value={form.username} onChange={handleChange("username")} placeholder="username" />
            </Field>
            <Field label="Mật khẩu" error={errors.password}>
              <input className={styles.input} value={form.password} onChange={handleChange("password")} placeholder="CLB@0015" />
            </Field>
          </div>

          <div className={styles.actions}>
            <button className={styles.cancelBtn} type="button" onClick={onClose}>Hủy</button>
            <button className={styles.submitBtn} type="submit">Tạo tài khoản</button>
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
  const email = form.email.trim().toLowerCase();
  const username = form.username.trim().toLowerCase();

  if (!memberId) errors.memberId = "Vui lòng nhập MSSV";
  else if (existingAccounts.some((account) => account.memberId === memberId)) {
    errors.memberId = "MSSV đã có tài khoản";
  }

  if (!form.name.trim()) errors.name = "Vui lòng nhập họ tên";
  if (!email) errors.email = "Vui lòng nhập email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email không hợp lệ";
  else if (existingAccounts.some((account) => account.email.toLowerCase() === email)) {
    errors.email = "Email đã tồn tại";
  }

  if (!username) errors.username = "Vui lòng nhập tên đăng nhập";
  else if (existingAccounts.some((account) => account.username.toLowerCase() === username)) {
    errors.username = "Tên đăng nhập đã tồn tại";
  }

  if (!form.password.trim()) errors.password = "Vui lòng nhập mật khẩu";

  return errors;
}
