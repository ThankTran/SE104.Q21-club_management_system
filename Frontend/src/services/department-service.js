import api from '../utils/api'

export const getDepartmentsAPI = () =>
  api.get('departments')

export const getDepartmentByIdAPI = (id) =>
  api.get(`departments/${id}`)

export const getDepartmentByNameAPI = (departmentName) =>
  api.get('departments/by-name', { params: { departmentName } })

export const createDepartmentAPI = (payload) =>
  api.post('departments', payload)

export const deleteDepartmentAPI = (id) =>
  api.delete(`departments/${id}`)

// Add PUT/PATCH /api/departments/{id} if frontend needs department editing.
