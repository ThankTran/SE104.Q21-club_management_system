import { useEffect, useMemo, useState } from "react";
import { UserCog } from "lucide-react";
import AccountCreateModal from "../../components/sections/Account/AccountCreateModal";
import AccountDetailPanel from "../../components/sections/Account/AccountDetailPanel";
import AccountTable from "../../components/sections/Account/AccountTable";
import AccountToolbar from "../../components/sections/Account/AccountToolbar";
import { MOCK_ACCOUNTS } from "../../data/Account/accountMockData";
import styles from "./AccountPage.module.css";

const PAGE_SIZE = 10;

export default function AccountPage() {
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [selectedId, setSelectedId] = useState(MOCK_ACCOUNTS[0].id);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdAtSort, setCreatedAtSort] = useState("desc");

  const filteredAccounts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return accounts
      .filter((account) => {
        const matchesSearch =
          !keyword ||
          account.name.toLowerCase().includes(keyword) ||
          account.username.toLowerCase().includes(keyword) ||
          account.email.toLowerCase().includes(keyword) ||
          account.memberId.toLowerCase().includes(keyword) ||
          account.department.toLowerCase().includes(keyword);
        return matchesSearch;
      })
      .sort((a, b) => {
        const aTime = parseDate(a.createdAt);
        const bTime = parseDate(b.createdAt);
        return createdAtSort === "desc" ? bTime - aTime : aTime - bTime;
      });
  }, [accounts, createdAtSort, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const selectedAccount =
    accounts.find((account) => account.id === selectedId) || filteredAccounts[0] || accounts[0];

  const updateAccount = (accountId, fields) => {
    setAccounts((current) =>
      current.map((account) => (account.id === accountId ? { ...account, ...fields } : account))
    );
  };

  const deleteAccount = (accountId) => {
    setAccounts((current) => {
      const nextAccounts = current.filter((account) => account.id !== accountId);
      if (selectedId === accountId) {
        setSelectedId(nextAccounts[0]?.id || "");
      }
      return nextAccounts;
    });
  };

  const createAccount = (formData) => {
    const nextAccount = {
      id: `ACC-${String(accounts.length + 1).padStart(3, "0")}`,
      memberId: formData.memberId,
      username: formData.username,
      password: formData.password,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: "active",
      lastLogin: "Chưa đăng nhập",
      createdAt: new Date().toLocaleDateString("vi-VN"),
      sessions: [],
    };

    setAccounts((current) => [nextAccount, ...current]);
    setSelectedId(nextAccount.id);
    setSearch("");
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý tài khoản đăng nhập</h1>
          <p className={styles.pageSubtitle}>
            Theo dõi quyền truy cập, vai trò và phiên đăng nhập của thành viên câu lạc bộ.
          </p>
        </div>
        <button className={styles.primaryBtn} type="button" onClick={() => setCreateOpen(true)}>
          <UserCog size={16} />
          Tạo tài khoản
        </button>
      </div>

      <AccountToolbar
        search={search}
        onSearchChange={setSearch}
      />

      <div className={styles.contentGrid}>
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div>
              <div className={styles.tableTitleRow}>
                <h2 className={styles.tableTitle}>Danh sách tài khoản</h2>
                <span className={styles.tableCount}>{filteredAccounts.length}</span>
              </div>
            </div>
          </div>

          <AccountTable
            accounts={paginatedAccounts}
            selectedId={selectedAccount?.id}
            onSelect={setSelectedId}
            sortDirection={createdAtSort}
            onSortCreatedAt={() => setCreatedAtSort((current) => (current === "desc" ? "asc" : "desc"))}
          />

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(currentPage * PAGE_SIZE, filteredAccounts.length)} trong tổng số{" "}
                {filteredAccounts.length} tài khoản
              </span>
              <div className={styles.paginationControls}>
                <button
                  className={styles.pageBtn}
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`${styles.pageBtn} ${currentPage === pageNumber ? styles.pageBtnActive : ""}`}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  className={styles.pageBtn}
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>

        <AccountDetailPanel
          account={selectedAccount}
          onAccountUpdate={(fields) => updateAccount(selectedAccount.id, fields)}
          onDelete={() => deleteAccount(selectedAccount.id)}
        />
      </div>

      <AccountCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={createAccount}
        existingAccounts={accounts}
      />
    </div>
  );
}

function parseDate(value) {
  const [day, month, year] = value.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}
