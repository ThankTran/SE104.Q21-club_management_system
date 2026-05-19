import { useEffect, useMemo, useState } from 'react';

import MemberTable from '../../components/sections/Member/MemberTable';
import MemberForm, { DEPARTMENTS } from '../../components/sections/Member/MemberForm';
import MemberFilter from '../../components/sections/Member/MemberFilter';
import MemberStatCard from '../../components/sections/Member/MemberStatCard';
import MemberDetailModal from '../../components/sections/Member/MemberDetailModal';
import MemberHistoryModal from '../../components/sections/Member/MemberHistoryModal';
import MemberReviewModal from '../../components/sections/Member/MemberReviewModal';
import MemberDeleteConfirmModal from '../../components/sections/Member/MemberDeleteConfirmModal';
import { MOCK_MEMBERS } from '../../data/Member/memberMockData';
import {
  approveMemberAPI,
  getMemberDepartmentsAPI,
  getMembersAPI,
  normalizeMemberFromApi,
  registerMemberAPI,
  toApprovalPayload,
  toMemberPayload,
  updateMemberAPI,
} from '../../services/member-service';
import styles from './MemberAdminPage.module.css';

const PAGE_SIZE = 8;

export default function MemberAdminPage() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [apiError, setApiError] = useState('');
  const [departmentOptions, setDepartmentOptions] = useState(DEPARTMENTS);
  const [activeTab, setActiveTab] = useState('review');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewType, setReviewType] = useState('approve');
  const [filterOpen, setFilterOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    let ignore = false;

    Promise.allSettled([getMembersAPI(), getMemberDepartmentsAPI()])
      .then(([membersResult, departmentsResult]) => {
        if (ignore) return;

        if (membersResult.status === 'fulfilled') {
          const nextMembers = Array.isArray(membersResult.value)
            ? membersResult.value.map(normalizeMemberFromApi)
            : [];
          setMembers(nextMembers.length ? nextMembers : MOCK_MEMBERS);
          setApiError('');
        } else {
          setMembers(MOCK_MEMBERS);
          setApiError(membersResult.reason?.message || 'Không tải được danh sách thành viên từ API.');
        }

        if (departmentsResult.status === 'fulfilled' && Array.isArray(departmentsResult.value)) {
          setDepartmentOptions(
            departmentsResult.value.map((department) => ({
              id: department.departmentId,
              name: department.departmentName,
            })),
          );
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const departmentNames = useMemo(
    () => departmentOptions.map((department) => department.name || department),
    [departmentOptions],
  );

  const getDepartmentId = (departmentName) => {
    const department = departmentOptions.find((item) => (item.name || item) === departmentName);
    return department?.id || null;
  };
  const statuses = useMemo(() => [...new Set(members.map((m) => m.requestStatus))], [members]);
  const roles = useMemo(() => [...new Set(members.map((m) => m.role))], [members]);

  const stats = useMemo(() => {
    const total = members.length;
    const pending = members.filter((m) => m.requestStatus === 'Đang xét duyệt').length;
    const approved = members.filter((m) => m.requestStatus === 'Đã duyệt').length;
    const rejected = members.filter((m) => m.requestStatus === 'Từ chối').length;
    return { total, pending, approved, rejected };
  }, [members]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members
      .filter((m) => {
        const matchSearch = !q ||
          m.name.toLowerCase().includes(q) ||
          m.id.includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q);
        const matchDepartment = !departmentFilter || m.department === departmentFilter;
        const matchesTab =
          activeTab === 'review'
            ? m.requestStatus === 'Đang xét duyệt'
            : m.requestStatus === 'Đã duyệt';
        const matchStatus = activeTab === 'review' || activeTab === 'lookup' || !statusFilter || m.requestStatus === statusFilter;
        const matchRole = !roleFilter || m.role === roleFilter;
        return matchesTab && matchSearch && matchDepartment && matchStatus && matchRole;
      })
      .sort((a, b) =>
        activeTab === 'review'
          ? new Date(a.registeredAt) - new Date(b.registeredAt)
          : a.name.localeCompare(b.name, 'vi')
      );
  }, [members, search, departmentFilter, statusFilter, roleFilter, activeTab]);

  const historyMembers = useMemo(
    () => members
      .filter((member) => member.requestStatus === 'Đã duyệt' || member.requestStatus === 'Từ chối')
      .sort((a, b) => new Date(b.reviewedAt || b.registeredAt) - new Date(a.reviewedAt || a.registeredAt)),
    [members],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (member) => {
    setEditTarget(member);
    setFormOpen(true);
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      const payload = toMemberPayload({
        ...formData,
        departmentId: formData.departmentId || getDepartmentId(formData.department),
      });

      if (editTarget) {
        const updated = await updateMemberAPI(editTarget.memberId || editTarget.id, payload);
        setMembers((prev) => prev.map((m) => (
          m.id === editTarget.id ? normalizeMemberFromApi(updated) : m
        )));
      } else {
        const created = await registerMemberAPI(payload);
        setMembers((prev) => [normalizeMemberFromApi(created), ...prev]);
      }
      setFormOpen(false);
      setPage(1);
      setApiError('');
    } catch (error) {
      setApiError(error?.message || 'Không lưu được hồ sơ thành viên.');
    } finally {
      setFormLoading(false);
    }
  };

  const openReview = (member, type) => {
    setReviewTarget(member);
    setReviewType(type);
  };

  const confirmReview = async (member, reviewData) => {
    try {
      if (member.memberId) {
        await approveMemberAPI(toApprovalPayload(member, reviewData));
      } else {
        // TODO(BE): Dữ liệu mock không có memberId nên không thể gọi /api/members/approve.
      }
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, ...reviewData } : m)));
      setReviewTarget(null);
      setApiError('');
    } catch (error) {
      setApiError(error?.message || 'Không cập nhật được trạng thái xét duyệt.');
    }
  };

  const confirmDelete = () => {
    // TODO(BE): Chưa có DELETE /api/members/{id}; tạm xoá local.
    setMembers((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <div className={styles.page}>
      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý thành viên</h1>
          <p className={styles.pageSubtitle}>
            Tiếp nhận hồ sơ đăng ký, kiểm tra điều kiện và xét duyệt thành viên câu lạc bộ.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.historyBtn} ${historyOpen ? styles.historyBtnActive : ''}`}
            onClick={() => setHistoryOpen(true)}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
              <path d="M12 7v5l3 2" />
            </svg>
            Lịch sử
          </button>

          <button className={styles.addBtn} onClick={openAdd}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Thêm hồ sơ
          </button>
        </div>
      </div>

      <div className={styles.statsRow}>
        <MemberStatCard label="Tổng hồ sơ" value={stats.total} sub="Tất cả phiếu đăng ký" />
        <MemberStatCard label="Chờ xét duyệt" value={stats.pending} sub="Cần xử lý" variant="warning" />
        <MemberStatCard label="Đã duyệt" value={stats.approved} sub="Thành viên hợp lệ" variant="success" />
        <MemberStatCard label="Từ chối" value={stats.rejected} sub="Hồ sơ không đạt" variant="danger" />
      </div>

      <div className={styles.workflowPanel}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'review' ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab('review'); setPage(1); }}
          >
            Chờ xét duyệt thành viên
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'lookup' ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab('lookup'); setPage(1); }}
          >
            Tra cứu thành viên
            <span>{stats.approved}</span>
          </button>
        </div>

        <div className={styles.tabControls}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Tìm theo tên, MSSV, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <MemberFilter
            open={filterOpen}
            setOpen={setFilterOpen}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            departments={departmentNames}
            statuses={statuses}
            roles={roles}
            showStatus={false}
          />
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle}>
              {activeTab === 'review' ? 'Phiếu thành viên chờ xét duyệt' : 'Danh sách thành viên'}
            </h2>
            <p className={styles.tableSubtitle}>
              {activeTab === 'review'
                ? 'Hồ sơ được xếp theo ngày đăng ký sớm nhất để xử lý trước.'
                : 'Tra cứu các thành viên hợp lệ trong câu lạc bộ.'}
            </p>
          </div>
          <span className={styles.tableCount}>{filtered.length} hồ sơ</span>
        </div>

        <MemberTable
          members={paginated}
          total={filtered.length}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={(p) => { if (p >= 1 && p <= totalPages) setPage(p); }}
          onEdit={openEdit}
          onDelete={setDeleteConfirm}
          onView={setDetailTarget}
          onApprove={(member) => openReview(member, 'approve')}
          onReject={(member) => openReview(member, 'reject')}
          isAdmin
          showActions
          showViewAction={false}
          showReviewActions={activeTab === 'review'}
          showContact={activeTab !== 'review'}
          showRegisteredAt={activeTab === 'review'}
        />
      </div>

      <button className={styles.fab} onClick={openAdd} title="Thêm hồ sơ">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      <MemberForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
        loading={formLoading}
        existingMembers={members}
        departments={departmentNames}
      />

      <MemberDetailModal member={detailTarget} onClose={() => setDetailTarget(null)} />
      <MemberHistoryModal
        open={historyOpen}
        members={historyMembers}
        onClose={() => setHistoryOpen(false)}
        onView={setDetailTarget}
      />
      <MemberReviewModal
        member={reviewTarget}
        type={reviewType}
        onClose={() => setReviewTarget(null)}
        onConfirm={confirmReview}
      />
      <MemberDeleteConfirmModal
        member={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
