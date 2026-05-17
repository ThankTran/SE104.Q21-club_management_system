import { useMemo, useState } from 'react';
import ResourceForm from '../../components/sections/Resource/ResourceForm';
import ResourceTable from '../../components/sections/Resource/ResourceTable';
import ResourceFilter from '../../components/sections/Resource/ResourceFilter';
import ResourceAdminHeader from '../../components/sections/Resource/ResourceAdminHeader';
import ResourceStats from '../../components/sections/Resource/ResourceStats';
import ResourceAdminTabs from '../../components/sections/Resource/ResourceAdminTabs';
import ResourceReviewModal from '../../components/sections/Resource/ResourceReviewModal';
import ResourceLookupTable from '../../components/sections/Resource/ResourceLookupTable';
import ResourceDeleteConfirmModal from '../../components/sections/Resource/ResourceDeleteConfirmModal';
import ResourceHistoryModal from '../../components/sections/Resource/ResourceHistoryModal';
import ResourceApproveModal from '../../components/sections/Resource/ResourceApproveModal';
import ResourceRejectModal from '../../components/sections/Resource/ResourceRejectModal';
import {
  INITIAL_RESOURCES,
  RESOURCE_RULES,
} from '../../components/sections/Resource/resourceAdminData';
import styles from './ResourceAdminPage.module.css';

export default function ResourceAdminPage() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [activeTab, setActiveTab] = useState('review');
  const [search, setSearch] = useState('');

  const [filterOpen, setFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');

  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const stats = useMemo(() => ({
    total: resources.length,
    pending: resources.filter((resource) => resource.status === 'pending').length,
    approved: resources.filter((resource) => resource.status === 'approved').length,
    rejected: resources.filter((resource) => resource.status === 'rejected').length,
  }), [resources]);

  const subjects = useMemo(
    () => [...new Set(resources.map((resource) => resource.subject))].sort(),
    [resources],
  );

  const filteredResources = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return resources
      .filter((resource) => {
        const matchesSearch =
          !normalizedSearch ||
          resource.title.toLowerCase().includes(normalizedSearch) ||
          resource.formCode.toLowerCase().includes(normalizedSearch) ||
          resource.subject.toLowerCase().includes(normalizedSearch) ||
          resource.uploadedBy.toLowerCase().includes(normalizedSearch);

        const matchesType = typeFilter === 'all' || resource.type === typeFilter;
        const matchesFormat = formatFilter === 'all' || resource.format === formatFilter;
        const matchesStatus =
          activeTab === 'review'
            ? resource.status === 'pending'
            : statusFilter === 'all' || resource.status === statusFilter;
        const matchesSubject = subjectFilter === 'all' || resource.subject === subjectFilter;

        return matchesSearch && matchesType && matchesFormat && matchesStatus && matchesSubject;
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [resources, search, typeFilter, formatFilter, statusFilter, subjectFilter, activeTab]);

  const historyResources = useMemo(
    () => resources
      .filter((resource) => resource.status === 'approved' || resource.status === 'rejected')
      .sort((a, b) => new Date(b.reviewedAt || b.createdAt) - new Date(a.reviewedAt || a.createdAt)),
    [resources],
  );

  const openCreateForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openApproveForm = (id) => {
    const resource = resources.find((item) => item.id === id);
    if (resource) setApproveTarget(resource);
  };

  const handleApprove = (id, lookupFolderId, reviewedAt = new Date().toISOString().split('T')[0]) => {
    setResources((prev) =>
      prev.map((resource) => {
        if (resource.id !== id) return resource;

        if (new Date(reviewedAt) < new Date(resource.createdAt)) {
          alert(RESOURCE_RULES.reviewDateAfterCreatedDate);
          return resource;
        }

        return {
          ...resource,
          status: 'approved',
          reviewedBy: 'Admin',
          reviewedAt,
          lookupFolderId,
          note: resource.note || 'Đã duyệt',
        };
      }),
    );
    setSelected(null);
    setApproveTarget(null);
    setRejectTarget(null);
  };

  const openRejectForm = (id) => {
    const resource = resources.find((item) => item.id === id);
    if (resource) setRejectTarget(resource);
  };

  const handleReject = (id, reason) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === id
          ? {
            ...resource,
            status: 'rejected',
            reviewedBy: 'Admin',
            reviewedAt: new Date().toISOString().split('T')[0],
            note: reason,
          }
          : resource,
      ),
    );
    setSelected(null);
    setRejectTarget(null);
  };

  const handleSubmit = (data) => {
    const normalizedTitle = data.title.trim().toLowerCase();
    const normalizedLink = data.link.trim().toLowerCase();

    const duplicate = resources.some((resource) =>
      resource.id !== editing?.id &&
      resource.title.trim().toLowerCase() === normalizedTitle &&
      resource.link.trim().toLowerCase() === normalizedLink
    );

    if (duplicate) {
      alert(RESOURCE_RULES.uniqueTitleAndLink);
      return;
    }

    if (editing) {
      setResources((prev) =>
        prev.map((resource) =>
          resource.id === editing.id
            ? { ...resource, ...data, status: resource.status }
            : resource,
        ),
      );
    } else {
      const today = new Date().toISOString().split('T')[0];
      const newResource = {
        ...data,
        id: Date.now(),
        formCode: `TL-${String(resources.length + 1).padStart(3, '0')}`,
        uploadedBy: 'Admin',
        memberId: 'ADMIN',
        memberRole: 'Quản trị viên',
        createdAt: today,
        status: 'pending',
        reviewedBy: '',
        reviewedAt: '',
        note: '',
      };
      setResources((prev) => [newResource, ...prev]);
    }

    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setResources((prev) => prev.filter((resource) => resource.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className={styles.page}>
      <ResourceAdminHeader
        onAddResource={openCreateForm}
        onOpenHistory={() => setHistoryOpen(true)}
        historyActive={historyOpen}
      />

      <ResourceStats stats={stats} />

      <div className={styles.workflowPanel}>
        <ResourceAdminTabs
          activeTab={activeTab}
          approvedCount={stats.approved}
          onChange={setActiveTab}
        />

        <div className={styles.controlRow}>
          <div className={styles.searchBox}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Tìm theo tên tài liệu, môn học, người đề xuất..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button type="button" className={styles.clearSearch} onClick={() => setSearch('')}>×</button>
            )}
          </div>

          {activeTab === 'review' && (
            <ResourceFilter
              open={filterOpen}
              setOpen={setFilterOpen}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              formatFilter={formatFilter}
              setFormatFilter={setFormatFilter}
              subjectFilter={subjectFilter}
              setSubjectFilter={setSubjectFilter}
              subjects={subjects}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              showStatus={false}
            />
          )}
        </div>
      </div>

      {activeTab === 'review' && (
        <>
          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <div>
                <h2 className={styles.tableTitle}>Phiếu tài liệu chờ duyệt</h2>
                <p className={styles.tableSubtitle}>
                  Danh sách phiếu đề xuất đang chờ admin xét duyệt.
                </p>
              </div>
              <span className={styles.tableCount}>{filteredResources.length} phiếu</span>
            </div>

            <ResourceTable
              resources={filteredResources}
              total={filteredResources.length}
              page={1}
              totalPages={1}
              pageSize={Math.max(filteredResources.length, 1)}
              onPageChange={() => {}}
              onView={setSelected}
              onEdit={(resource) => {
                setEditing(resource);
                setFormOpen(true);
              }}
              onApprove={openApproveForm}
              onReject={openRejectForm}
              onDelete={setDeleteTarget}
              loading={false}
            />
          </div>
        </>
      )}

      {activeTab === 'lookup' && (
        <ResourceLookupTable resources={resources} search={search} onView={setSelected} />
      )}

      <ResourceReviewModal
        resource={selected}
        onClose={() => setSelected(null)}
        onApprove={openApproveForm}
        onReject={openRejectForm}
      />

      <ResourceForm
        open={formOpen}
        initial={editing}
        isAdmin
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ResourceDeleteConfirmModal
        resource={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <ResourceApproveModal
        resource={approveTarget}
        onCancel={() => setApproveTarget(null)}
        onConfirm={handleApprove}
      />

      <ResourceRejectModal
        resource={rejectTarget}
        onCancel={() => setRejectTarget(null)}
        onConfirm={handleReject}
      />

      <ResourceHistoryModal
        open={historyOpen}
        resources={historyResources}
        onClose={() => setHistoryOpen(false)}
        onView={setSelected}
        onEdit={(resource) => {
          setEditing(resource);
          setFormOpen(true);
        }}
        onApprove={openApproveForm}
        onReject={openRejectForm}
        onDelete={setDeleteTarget}
      />
    </div>
  );
}
