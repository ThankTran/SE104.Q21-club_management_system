import { useMemo, useState } from 'react';

import EventForm from '../../components/sections/Event/EventForm';
import exportEventsExcel from '../../utils/Export/exportEventsExcel';

import EventAdminHeader from '../../components/sections/Event/EventAdminHeader';
import EventDeleteConfirmModal from '../../components/sections/Event/EventDeleteConfirmModal';
import EventEvaluationModal from '../../components/sections/Event/EventEvaluationModal';
import EventFiscalSummary from '../../components/sections/Event/EventFiscalSummary';
import EventRegistrationModal from '../../components/sections/Event/EventRegistrationModal';
import EventRosterTable from '../../components/sections/Event/EventRosterTable';
import {
  MOCK_EVENTS,
  PAGE_SIZE,
  REGISTERED_MEMBER_POOL,
  STATUS_LABEL,
  TAG_FILTERS,
  TAG_LABEL,
} from '../../data/eventAdminData';
import {
  buildRegisteredMembers,
  createEvaluationCode,
  normalizeEvent,
} from '../../utils/Event/eventAdminUtils';
import styles from './EventAdminPage.module.css';

export default function EventAdminPage() {
  const [events, setEvents] = useState(() => MOCK_EVENTS.map(normalizeEvent));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dateSort, setDateSort] = useState('nearest');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [evaluationTarget, setEvaluationTarget] = useState(null);
  const [evaluationForm, setEvaluationForm] = useState({ evaluationDate: '', evaluation: '' });
  const [evaluationErrors, setEvaluationErrors] = useState({});
  const [evaluations, setEvaluations] = useState([]);
  const [registrationTarget, setRegistrationTarget] = useState(null);

  const totalEstimated = events.reduce((sum, event) => sum + (Number(event.estimatedCost) || 0), 0);
  const totalActual = events
    .filter((event) => event.status === 'completed')
    .reduce((sum, event) => sum + (Number(event.estimatedCost) * 0.9 || 0), 0);
  const publishedCount = events.filter((event) => event.status === 'published').length;

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    const result = events.filter((event) => {
      const matchSearch =
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);
      const matchStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchTag = tagFilter === 'all' || event.tag === tagFilter;

      return matchSearch && matchStatus && matchTag;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateSort === 'nearest' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [events, search, statusFilter, tagFilter, dateSort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rosterSummary = useMemo(() => {
    const activityCount = filtered.length;
    const totalAttendance = filtered.reduce((sum, event) => sum + Number(event.attendance || 0), 0);
    const totalCapacity = filtered.reduce((sum, event) => sum + Number(event.capacity || 0), 0);
    const attendanceRate = totalCapacity > 0 ? Math.round((totalAttendance / totalCapacity) * 100) : 0;

    return { activityCount, totalAttendance, attendanceRate };
  }, [filtered]);
  const registeredMembers = useMemo(
    () => buildRegisteredMembers(registrationTarget, REGISTERED_MEMBER_POOL),
    [registrationTarget],
  );

  const openAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (event) => {
    setEditTarget(event);
    setFormOpen(true);
  };

  const handleSubmit = (formData) => {
    setFormLoading(true);
    setTimeout(() => {
      if (editTarget) {
        setEvents((prev) =>
          prev.map((event) => (event.id === editTarget.id ? { ...event, ...formData } : event)),
        );
      } else {
        const newId = events.length ? Math.max(...events.map((event) => event.id)) + 1 : 1;
        setEvents((prev) => [{ ...formData, id: newId, attendance: 0, status: 'draft' }, ...prev]);
      }
      setFormLoading(false);
      setFormOpen(false);
    }, 800);
  };

  const updateEventStatus = (eventId, status) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, status } : event)),
    );
  };

  const confirmDelete = () => {
    setEvents((prev) => prev.filter((event) => event.id !== deleteConfirm.id));
    setEvaluations((prev) => prev.filter((item) => item.eventCode !== deleteConfirm.eventCode));
    setDeleteConfirm(null);
  };

  const openEvaluation = (event) => {
    const current = evaluations.find((item) => item.eventCode === event.eventCode);
    setEvaluationTarget(event);
    setEvaluationForm({
      evaluationDate: current?.evaluationDate || '',
      evaluation: current?.evaluation || '',
    });
    setEvaluationErrors({});
  };

  const getEvaluationCode = (event) =>
    evaluations.find((item) => item.eventCode === event.eventCode)?.id ||
    createEvaluationCode(event.eventCode, evaluations.length);

  const closeEvaluation = () => {
    setEvaluationTarget(null);
    setEvaluationForm({ evaluationDate: '', evaluation: '' });
    setEvaluationErrors({});
  };

  const updateEvaluationForm = (field, value) => {
    setEvaluationForm((prev) => ({ ...prev, [field]: value }));
    setEvaluationErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const submitEvaluation = () => {
    const errs = {};
    const eventEndDate = evaluationTarget?.date ? new Date(evaluationTarget.date) : null;
    const evaluationDate = evaluationForm.evaluationDate ? new Date(evaluationForm.evaluationDate) : null;

    if (!evaluationForm.evaluationDate) errs.evaluationDate = 'Vui lòng chọn ngày đánh giá';
    if (eventEndDate && evaluationDate && evaluationDate <= eventEndDate) {
      errs.evaluationDate = 'Ngày đánh giá phải lớn hơn ngày kết thúc sự kiện';
    }
    if (!evaluationForm.evaluation.trim()) errs.evaluation = 'Vui lòng nhập nội dung đánh giá';

    if (Object.keys(errs).length) {
      setEvaluationErrors(errs);
      return;
    }

    setEvaluations((prev) => {
      const existed = prev.find((item) => item.eventCode === evaluationTarget.eventCode);
      const nextItem = {
        id: existed?.id || createEvaluationCode(evaluationTarget.eventCode, prev.length),
        eventCode: evaluationTarget.eventCode,
        eventTitle: evaluationTarget.title,
        evaluationDate: evaluationForm.evaluationDate,
        evaluation: evaluationForm.evaluation.trim(),
      };

      return existed
        ? prev.map((item) => (item.eventCode === evaluationTarget.eventCode ? nextItem : item))
        : [...prev, nextItem];
    });
    closeEvaluation();
  };

  return (
    <div className={styles.page}>
      <EventAdminHeader onExport={() => exportEventsExcel(filtered)} onAdd={openAdd} />

      <EventFiscalSummary totalEstimated={totalEstimated} totalActual={totalActual} />

      <EventRosterTable
        events={paginated}
        filteredCount={filtered.length}
        summary={rosterSummary}
        page={page}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        dateSort={dateSort}
        setDateSort={setDateSort}
        publishedCount={publishedCount}
        statusLabels={STATUS_LABEL}
        tagLabels={TAG_LABEL}
        tagFilters={TAG_FILTERS}
        evaluations={evaluations}
        onEdit={openEdit}
        onEvaluate={openEvaluation}
        onViewRegistrations={setRegistrationTarget}
        onUpdateStatus={updateEventStatus}
        onDelete={setDeleteConfirm}
      />

      <button className={styles.fab} onClick={openAdd} title="Tạo sự kiện mới">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      <EventForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
        loading={formLoading}
        existingEvents={events}
      />

      <EventEvaluationModal
        event={evaluationTarget}
        form={evaluationForm}
        errors={evaluationErrors}
        evaluationCode={evaluationTarget ? getEvaluationCode(evaluationTarget) : ''}
        onChange={updateEvaluationForm}
        onClose={closeEvaluation}
        onSubmit={submitEvaluation}
      />

      <EventDeleteConfirmModal
        event={deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
      />

      <EventRegistrationModal
        event={registrationTarget}
        members={registeredMembers}
        onClose={() => setRegistrationTarget(null)}
      />
    </div>
  );
}
