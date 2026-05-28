import api from '../utils/api'

export const getSubjectsAPI = () =>
  api.get('subjects')

export const getSubjectByIdAPI = (id) =>
  api.get(`subjects/${id}`)

export const createSubjectAPI = (payload) =>
  api.post('subjects', payload)

export const updateSubjectAPI = (id, payload) =>
  api.put(`subjects/${id}`, payload)

export const deleteSubjectAPI = (id) =>
  api.delete(`subjects/${id}`)

// Add GET /api/subjects/by-name or /api/subjects/search if frontend needs subject lookup.
