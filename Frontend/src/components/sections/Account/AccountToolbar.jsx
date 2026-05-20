import { Search } from "lucide-react";
import styles from "./AccountToolbar.module.css";

export default function AccountToolbar({ search, onSearchChange }) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchWrap}>
        <Search size={15} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm theo tên, mã thành viên, email, khoa..."
        />
      </div>
    </div>
  );
}
