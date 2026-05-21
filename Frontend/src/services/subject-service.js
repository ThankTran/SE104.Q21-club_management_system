import api from '../utils/api'

export const getSubjectsAPI = () =>
  api.get('subjects')

export const getSubjectByIdAPI = (id) =>
  api.get(`subjects/${id}`)

export const createSubjectAPI = (payload) =>
  api.post('subjects', payload)

export const deleteSubjectAPI = (id) =>
  api.delete(`subjects/${id}`)

// Add GET /api/subjects/by-name or /api/subjects/search if frontend needs subject lookup.
// Add PUT/PATCH /api/subjects/{id} if frontend needs subject editing.
