import { useMemo, useState } from 'react';

import MemberTable from '../../components/sections/Member/MemberTable';
import MemberUserFilterBar from '../../components/sections/Member/MemberUserFilterBar';
import { MOCK_USER_MEMBERS } from '../../components/sections/Member/memberUserMockData';
import styles from './MemberUserPage.module.css';

const PAGE_SIZE = 10;

export default function MemberUserPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('Tất cả');
  const [page, setPage] = useState(1);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleDeptChange = (value) => {
    setDept(value);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_USER_MEMBERS.filter((m) => {
      const matchSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        m.id.includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q);
      const matchDept = dept === 'Tất cả' || m.department === dept;
      return matchSearch && matchDept;
    });
  }, [search, dept]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Danh sách thành viên</h1>
          <p className={styles.pageSubtitle}>
            Tra cứu thông tin các thành viên đã được xét duyệt trong câu lạc bộ.
          </p>
        </div>

        <div className={styles.totalBadge}>
          <span className={styles.totalNum}>{MOCK_USER_MEMBERS.length.toLocaleString()}</span>
          <span className={styles.totalLabel}>thành viên</span>
        </div>
      </div>

      <MemberUserFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        dept={dept}
        onDeptChange={handleDeptChange}
      />

      <MemberTable
        members={paginated}
        total={filtered.length}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={(p) => { if (p >= 1 && p <= totalPages) setPage(p); }}
        isAdmin={false}
        showRequestStatus={false}
      />
    </div>
  );
}
