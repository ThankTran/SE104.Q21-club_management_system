import api from '../utils/api'

const toDatePart = (value) => (value ? String(value).slice(0, 10) : '')
const toTimePart = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value).slice(11, 16)
  return date.toTimeString().slice(0, 5)
}

const toDateTime = (date, time) => {
  if (!date || !time) return null
  return `${date}T${time}:00`
}

const mapEventStatusToUi = (status, reqStatus) => {
  if (reqStatus === 'PENDING') return 'draft'
  if (status === 'Finished') return 'completed'
  if (status === 'Cancelled') return 'cancelled'
  return 'published'
}

const mapEventStatusToApi = (status) => {
  if (status === 'completed') return 'Finished'
  if (status === 'cancelled') return 'Cancelled'
  if (status === 'published') return 'NotStarted'
  return 'NotStarted'
}

export const normalizeEventFromApi = (event = {}) => ({
  id: event.eventId,
  eventCode: event.eventId || '',
  title: event.eventName || '',
  date: toDatePart(event.eventDate || event.startTime),
  time: toTimePart(event.startTime),
  endTime: toTimePart(event.endTime),
  location: event.location || '',
  estimatedCost: Number(event.estimatedCost || 0),
  description: event.description || '',
  capacity: event.capacity || '',
  organizer: event.organizer || '',
  tag: event.tag || 'OTHER',
  status: mapEventStatusToUi(event.status, event.reqStatus),
  attendance: event.attendance || 0,
  createdAt: toDatePart(event.createdAt),
  evaluationDate: toDatePart(event.evaluationDate),
  evaluation: event.evaluationContent || '',
  raw: event,
})

export const toEventPayload = (event = {}) => ({
  eventId: event.eventCode || event.id,
  eventName: event.title,
  location: event.location,
  eventDate: event.date,
  startTime: toDateTime(event.date, event.time),
  endTime: toDateTime(event.date, event.endTime),
  estimatedCost: Number(event.estimatedCost || 0),
  status: mapEventStatusToApi(event.status),
  reqStatus: event.status === 'draft' ? 'PENDING' : 'APPROVED',
  description: event.description || '',
  evaluatedById: event.evaluatedById || null,
  evaluationDate: event.evaluationDate ? `${event.evaluationDate}T00:00:00` : null,
  evaluationContent: event.evaluation || '',
})

export const getEventsAPI = () =>
  api.get('events')

export const getEventByIdAPI = (id) =>
  api.get(`events/${id}`)

export const searchEventsAPI = (name) =>
  api.get('events/search', { params: { name } })

export const getEventsByDateRangeAPI = (from, to) =>
  api.get('events/by-date-range', { params: { from, to } })

export const createEventAPI = (payload) =>
  api.post('events', payload)

export const deleteEventAPI = (id) =>
  api.delete(`events/${id}`)

// Add PUT/PATCH /api/events/{id} for editing events.
// Add endpoints for registration/attendance/evaluation if those workflows must persist.

export const createEventOrganizerAPI = (payload) =>
  api.post('event-organizers', payload)

export const getEventOrganizersByEventAPI = (eventId) =>
  api.get(`event-organizers/by-event/${eventId}`)

export const getEventOrganizersByMemberAPI = (memberId) =>
  api.get(`event-organizers/by-member/${memberId}`)

export const deleteEventOrganizerAPI = (eventId, memberId) =>
  api.delete(`event-organizers/${eventId}/members/${memberId}`)

export const createEventRoleAPI = (payload) =>
  api.post('event-roles', payload)

export const getEventRolesAPI = () =>
  api.get('event-roles')

export const getEventRoleByNameAPI = (roleName) =>
  api.get('event-roles/by-name', { params: { roleName } })

export const registerEventAPI = (eventId, memberId) =>
  api.post(`events/${eventId}/registrations`, { memberId })

export const unregisterEventAPI = (eventId, memberId) =>
  api.delete(`events/${eventId}/registrations/${memberId}`)

export const updateEventAttendanceAPI = (eventId, payload) =>
  api.put(`events/${eventId}/attendance`, payload)

export const createEventEvaluationAPI = (payload) =>
  api.post('event-evaluations', payload)

export const getEventEvaluationByEventAPI = (eventId) =>
  api.get(`event-evaluations/by-event/${eventId}`)
