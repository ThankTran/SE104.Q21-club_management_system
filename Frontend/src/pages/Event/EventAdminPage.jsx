import { useEffect, useMemo, useState } from 'react';

import EventForm from '../../components/sections/Event/EventForm';
import exportEventsExcel from '../../utils/Export/exportEventsExcel';

import EventAdminHeader from '../../components/sections/Event/EventAdminHeader';
import EventDeleteConfirmModal from '../../components/sections/Event/EventDeleteConfirmModal';
import EventEvaluationHistoryModal from '../../components/sections/Event/EventEvaluationHistoryModal';
import EventEvaluationModal from '../../components/sections/Event/EventEvaluationModal';
import EventFiscalSummary from '../../components/sections/Event/EventFiscalSummary';
import EventRegistrationModal from '../../components/sections/Event/EventRegistrationModal';
import EventRosterTable from '../../components/sections/Event/EventRosterTable';
import exportEventRegistrationsExcel from '../../utils/Export/exportEventRegistrationsExcel';
import {
  createEventAPI,
  createEventEvaluationAPI,
  deleteEventAPI,
  getEventRegistrationsByEventAPI,
  getEventsAPI,
  normalizeEventRegistrationFromApi,
  normalizeEventFromApi,
  toEventPayload,
  updateEventAPI,
} from '../../services/event-service';
import {
  PAGE_SIZE,
  STATUS_LABEL,
  TAG_FILTERS,
  TAG_LABEL,
} from '../../data/Event/eventAdminData';
import {
  createEvaluationCode,
} from '../../utils/Event/eventAdminUtils';
import styles from './EventAdminPage.module.css';

const getTodayDateInputValue = () => {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const buildEvaluationsFromEvents = (events) =>
  events
    .filter((event) => event.evaluation)
    .map((event, index) => ({
      id: createEvaluationCode(event.eventCode, index),
      eventCode: event.eventCode,
      eventTitle: event.title,
      evaluationDate: event.evaluationDate,
      evaluation: event.evaluation,
    }));

export default function EventAdminPage() {
  const [events, setEvents] = useState([]);
  const [apiError, setApiError] = useState('');
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
  const [evaluationHistoryOpen, setEvaluationHistoryOpen] = useState(false);
  const [registrationTarget, setRegistrationTarget] = useState(null);
  const [registeredMembers, setRegisteredMembers] = useState([]);

  useEffect(() => {
    let ignore = false;

    getEventsAPI()
      .then((data) => {
        if (ignore) return;
        const nextEvents = Array.isArray(data) ? data.map(normalizeEventFromApi) : [];
        setEvents(nextEvents);
        setEvaluations(buildEvaluationsFromEvents(nextEvents));
        setApiError('');
      })
      .catch((error) => {
        if (ignore) return;
        setApiError(error?.message || 'Không tải được danh sách sự kiện từ API.');
        setEvents([]);
        setEvaluations([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!registrationTarget) {
      setRegisteredMembers([]);
      return;
    }

    let ignore = false;
    getEventRegistrationsByEventAPI(registrationTarget.id)
      .then((data) => {
        if (ignore) return;
        setRegisteredMembers(Array.isArray(data) ? data.map(normalizeEventRegistrationFromApi) : []);
      })
      .catch((error) => {
        if (ignore) return;
        setRegisteredMembers([]);
        setApiError(error?.message || 'Khong tai duoc danh sach dang ky su kien.');
      });

    return () => {
      ignore = true;
    };
  }, [registrationTarget]);

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
  const openAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (event) => {
    setEditTarget(event);
    setFormOpen(true);
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editTarget) {
        const updated = await updateEventAPI(editTarget.id, toEventPayload(formData));
        setEvents((prev) =>
          prev.map((event) => (event.id === editTarget.id ? normalizeEventFromApi(updated) : event)),
        );
      } else {
        const created = await createEventAPI(toEventPayload({ ...formData, status: 'draft' }));
        setEvents((prev) => [
          normalizeEventFromApi(created),
          ...prev,
        ]);
      }
      setFormOpen(false);
      setApiError('');
    } catch (error) {
      setApiError(error?.message || 'Không lưu được sự kiện.');
    } finally {
      setFormLoading(false);
    }
  };

  const updateEventStatus = async (eventId, status) => {
    const current = events.find((event) => event.id === eventId);
    if (!current) return;

    try {
      const updated = await updateEventAPI(eventId, toEventPayload({ ...current, status }));
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? normalizeEventFromApi(updated) : event)),
      );
      setApiError('');
    } catch (error) {
      setApiError(error?.message || 'Khong cap nhat duoc trang thai su kien.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteEventAPI(deleteConfirm.id);
      setEvents((prev) => prev.filter((event) => event.id !== deleteConfirm.id));
      setEvaluations((prev) => prev.filter((item) => item.eventCode !== deleteConfirm.eventCode));
      setDeleteConfirm(null);
      setApiError('');
    } catch (error) {
      setApiError(error?.message || 'Không xoá được sự kiện.');
    }
  };

  const openEvaluation = (event) => {
    const current = evaluations.find((item) => item.eventCode === event.eventCode);
    setEvaluationTarget(event);
    setEvaluationForm({
      evaluationDate: getTodayDateInputValue(),
      evaluation: current?.evaluation || '',
    });
    setEvaluationErrors({});
  };

  const openEvaluationFromHistory = (evaluation) => {
    const event = events.find((item) => item.eventCode === evaluation.eventCode);
    if (!event) return;

    openEvaluation(event);
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

  const submitEvaluation = async () => {
    const errs = {};
    const selectedDate = evaluationForm.evaluationDate || getTodayDateInputValue();
    const eventEndDate = evaluationTarget?.date ? new Date(evaluationTarget.date) : null;
    const evaluationDate = new Date(selectedDate);

    if (eventEndDate && evaluationDate && evaluationDate <= eventEndDate) {
      errs.evaluationDate = 'Ngày đánh giá phải lớn hơn ngày kết thúc sự kiện';
    }
    if (!evaluationForm.evaluation.trim()) errs.evaluation = 'Vui lòng nhập nội dung đánh giá';

    if (Object.keys(errs).length) {
      setEvaluationErrors(errs);
      return;
    }

    try {
      const saved = await createEventEvaluationAPI({
        eventId: evaluationTarget.id,
        evaluationDate: `${selectedDate}T23:59:59`,
        evaluationContent: evaluationForm.evaluation.trim(),
      });
      const nextItem = {
        id: createEvaluationCode(evaluationTarget.eventCode, evaluations.length),
        eventCode: saved.eventId,
        eventTitle: saved.eventName || evaluationTarget.title,
        evaluationDate: saved.evaluationDate ? String(saved.evaluationDate).slice(0, 10) : selectedDate,
        evaluation: saved.evaluationContent || evaluationForm.evaluation.trim(),
      };

      setEvaluations((prev) => {
        const existed = prev.find((item) => item.eventCode === evaluationTarget.eventCode);
        return existed
          ? prev.map((item) => (item.eventCode === evaluationTarget.eventCode ? { ...nextItem, id: item.id } : item))
          : [...prev, nextItem];
      });
      setEvents((prev) =>
        prev.map((event) =>
          event.id === evaluationTarget.id
            ? { ...event, evaluationDate: nextItem.evaluationDate, evaluation: nextItem.evaluation }
            : event,
        ),
      );
      closeEvaluation();
      setApiError('');
    } catch (error) {
      setApiError(error?.message || 'Khong luu duoc danh gia su kien.');
    }
  };

  return (
    <div className={styles.page}>
      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <EventAdminHeader
        onExport={() => exportEventsExcel(filtered)}
        onAdd={openAdd}
        onViewEvaluationHistory={() => setEvaluationHistoryOpen(true)}
      />

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

      <EventEvaluationHistoryModal
        open={evaluationHistoryOpen}
        evaluations={evaluations}
        onClose={() => setEvaluationHistoryOpen(false)}
        onSelectEvaluation={openEvaluationFromHistory}
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
        onExport={() => exportEventRegistrationsExcel(registrationTarget, registeredMembers)}
      />
    </div>
  );
}
