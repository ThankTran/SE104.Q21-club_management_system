import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./AccountTable.module.css";

const roleStyle = {
  "Chu nhiem": { background: "#dff0f7", color: "#1a6b8a" },
  "Pho chu nhiem": { background: "#e8f4e8", color: "#276749" },
  "Trưởng ban học tập": { background: "#ede8f8", color: "#5b3fa8" },
  "Trưởng ban sự kiện": { background: "#fef3c7", color: "#92400e" },
  "Thành viên": { background: "#e8ecf2", color: "#3a4a5c" },
};

export default function AccountTable({ accounts, selectedId, onSelect, sortDirection, onSortCreatedAt }) {
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePassword = (accountId) => {
    setVisiblePasswords((current) => ({
      ...current,
      [accountId]: !current[accountId],
    }));
  };

  if (!accounts.length) {
    return (
      <div className={styles.empty}>
        <p>Không tìm thấy tài khoản phù hợp.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tài khoản</th>
            <th>Tên đăng nhập</th>
            <th>Mật khẩu</th>
            <th>Vai trò</th>
            <th>Lần đăng nhập cuối</th>
            <th>
              <button className={styles.sortBtn} type="button" onClick={onSortCreatedAt}>
                Ngày tạo
                {sortDirection === "desc" ? "↓" : "↑"}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const isPasswordVisible = visiblePasswords[account.id];
            const passwordValue = account.password || "";

            return (
              <tr
                key={account.id}
                className={`${styles.row} ${selectedId === account.id ? styles.selectedRow : ""}`}
                onClick={() => onSelect(account.id)}
              >
                <td>
                  <div className={styles.accountCell}>
                    <div className={styles.avatar}>{getInitials(account.name)}</div>
                    <div>
                      <p className={styles.name}>{account.name || "Chưa cập nhật"}</p>
                      <p className={styles.meta}>MSSV: {account.memberId || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.username}>{account.username || "Chưa cập nhật"}</span>
                </td>
                <td>
                  <div className={styles.passwordCell} onClick={(event) => event.stopPropagation()}>
                    <span title={isPasswordVisible ? passwordValue : ""}>
                      {isPasswordVisible ? passwordValue || "Đã mã hóa" : maskPassword(passwordValue)}
                    </span>
                    <button
                      className={styles.eyeBtn}
                      type="button"
                      title={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      aria-label={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      onClick={() => togglePassword(account.id)}
                    >
                      {isPasswordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </td>
                <td>
                  <span
                    className={styles.roleBadge}
                    style={roleStyle[account.role] || { background: "#f3f4f6", color: "#374151" }}
                  >
                    {account.role}
                  </span>
                </td>
                <td className={styles.lastLogin}>{account.lastLogin}</td>
                <td className={styles.lastLogin}>{account.createdAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function maskPassword(password) {
  return "•".repeat(password ? 12 : 8);
}

function getInitials(name = "") {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initials || "NA";
}
