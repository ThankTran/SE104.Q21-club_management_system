import api from '../utils/api'

export const normalizeResourceFromApi = (resource = {}) => ({
  id: resource.documentId,
  title: resource.documentName || '',
  formCode: `TL-${String(resource.documentId || '').padStart(3, '0')}`,
  typeId: resource.typeId,
  type: resource.typeName || '',
  subjectId: resource.subjectId,
  subject: resource.subjectName || '',
  status: resource.reqStatus === 'APPROVED'
    ? 'approved'
    : resource.reqStatus === 'REJECTED'
      ? 'rejected'
      : 'pending',
  format: resource.format || 'Khác',
  source: resource.source || '',
  description: resource.note || '',
  link: resource.fileUrl || '',
  uploadedBy: resource.proposedById ? String(resource.proposedById) : 'Admin',
  memberId: resource.proposedById,
  reviewedBy: resource.approvedById ? String(resource.approvedById) : '',
  reviewedAt: resource.approvedAt ? String(resource.approvedAt).slice(0, 10) : '',
  createdAt: resource.createdAt ? String(resource.createdAt).slice(0, 10) : '',
  note: resource.note || '',
  raw: resource,
})

export const toResourcePayload = (resource = {}) => ({
  documentName: resource.title,
  typeId: Number(resource.typeId || resource.type),
  subjectId: Number(resource.subjectId || resource.subject),
  source: resource.source || resource.link || '',
  note: resource.description || resource.note || '',
  proposedById: resource.proposedById || null,
})

export const getResourcesAPI = () =>
  api.get('documents')

export const getResourceByIdAPI = (id) =>
  api.get(`documents/${id}`)

export const searchResourcesAPI = (name) =>
  api.get('documents/search', { params: { name } })

export const getResourcesBySubjectAPI = (subjectId) =>
  api.get(`documents/by-subject/${subjectId}`)

export const getResourcesByTypeAPI = (typeId) =>
  api.get(`documents/by-type/${typeId}`)

export const createResourceAPI = (payload) =>
  api.post('documents', payload)

export const softDeleteResourceAPI = (id) =>
  api.delete(`documents/${id}`)

export const hardDeleteResourceAPI = (id) =>
  api.delete(`documents/${id}/hard`)

export const createResourceFileAPI = (payload) =>
  api.post('document-files', payload)

export const getResourceFilesAPI = (documentId) =>
  api.get(`document-files/by-document/${documentId}`)

export const deleteResourceFileAPI = (fileId) =>
  api.delete(`document-files/${fileId}`)

export const createResourceTypeAPI = (payload) =>
  api.post('document-types', payload)

export const getResourceTypesAPI = () =>
  api.get('document-types')

export const getResourceTypeByNameAPI = (typeName) =>
  api.get('document-types/by-name', { params: { name: typeName } })

export const createResourceStatusAPI = (payload) =>
  api.post('document-statuses', payload)

export const getResourceStatusesAPI = () =>
  api.get('document-statuses')

export const getResourceStatusByNameAPI = (statusName) =>
  api.get('document-statuses/by-name', { params: { name: statusName } })

// DocumentRequest requires numeric typeId/subjectId. If the form keeps free-text
// type/subject, FE must resolve or create lookup records before POST /api/documents.
// Add fileUrl on DocumentResponse or include document-files in document detail response.
// Add PUT/PATCH /api/documents/{id} for editing resource metadata.
// Add approve/reject endpoints for resource review workflow.
// Add search pagination/limit and approved-only filter for BM8.
