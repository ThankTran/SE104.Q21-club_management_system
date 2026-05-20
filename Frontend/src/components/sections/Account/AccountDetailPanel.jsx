import { useEffect, useState } from "react";
import { KeyRound, Monitor, Save, Trash2 } from "lucide-react";
import styles from "./AccountDetailPanel.module.css";

export default function AccountDetailPanel({ account, onAccountUpdate, onDelete }) {
  const [editingAccount, setEditingAccount] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [passwordDraft, setPasswordDraft] = useState("");
  const [accountSaved, setAccountSaved] = useState(false);

  useEffect(() => {
    setUsernameDraft(account?.username || "");
    setPasswordDraft(account?.password || "");
    setEditingAccount(false);
    setAccountSaved(false);
  }, [account?.id, account?.username, account?.password]);

  if (!account) {
    return null;
  }

  const handleAccountAction = () => {
    if (!editingAccount) {
      setEditingAccount(true);
      return;
    }

    onAccountUpdate({
      username: usernameDraft.trim(),
      password: passwordDraft,
    });
    setEditingAccount(false);
    setAccountSaved(true);
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.profile}>
        <div className={styles.avatar}>{getInitials(account.name)}</div>
        <div>
          <h2 className={styles.name}>{account.name}</h2>
          <p className={styles.meta}>{account.memberId} · {account.role}</p>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div>
          <span>Email</span>
          <strong>{account.email}</strong>
        </div>
        <div>
          <span>Khoa</span>
          <strong>{formatDepartment(account.department)}</strong>
        </div>
        <div>
          <span>Tên đăng nhập</span>
          {editingAccount ? (
            <input
              className={styles.accountInput}
              value={usernameDraft}
              onChange={(event) => setUsernameDraft(event.target.value)}
              autoFocus
            />
          ) : (
            <strong className={styles.monoValue}>{account.username}</strong>
          )}
        </div>
        <div>
          <span>Mật khẩu</span>
          {editingAccount ? (
            <input
              className={styles.accountInput}
              value={passwordDraft}
              onChange={(event) => setPasswordDraft(event.target.value)}
            />
          ) : (
            <strong className={styles.monoValue}>{account.password}</strong>
          )}
        </div>
        <div>
          <span>Ngày tạo</span>
          <strong>{account.createdAt}</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn} type="button" onClick={handleAccountAction}>
          {editingAccount ? <Save size={15} /> : <KeyRound size={15} />}
          {editingAccount ? "Cập nhật tài khoản" : accountSaved ? "Sửa tài khoản" : "Sửa thông tin tài khoản"}
        </button>
        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} type="button" onClick={onDelete}>
          <Trash2 size={15} />
          Xóa tài khoản
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Phiên đăng nhập</h3>
          <span>{account.sessions.length}</span>
        </div>
        <div className={styles.sessionList}>
          {account.sessions.length ? (
            account.sessions.map((session) => (
              <div key={session.id} className={styles.sessionItem}>
                <div className={styles.sessionIcon}>
                  <Monitor size={16} />
                </div>
                <div>
                  <p>{session.device}</p>
                  <span>{session.location} · IP: {session.ip}</span>
                  <small>{session.time}</small>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>Không có phiên đăng nhập đang hoạt động.</p>
          )}
        </div>
      </div>
    </aside>
  );
}

function formatDepartment(department) {
  return department?.replace(/^Khoa\s+/i, "") || "";
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}
