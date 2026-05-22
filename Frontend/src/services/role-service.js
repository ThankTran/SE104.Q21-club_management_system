import api from '../utils/api'

export const getRolesAPI = () =>
  api.get('roles')

export const getRoleByIdAPI = (id) =>
  api.get(`roles/${id}`)

export const getRoleByNameAPI = (roleName) =>
  api.get('roles/by-name', { params: { name: roleName } })

export const createRoleAPI = (payload) =>
  api.post('roles', payload)

export const deleteRoleAPI = (id) =>
  api.delete(`roles/${id}`)

// Add PUT/PATCH /api/roles/{id} if frontend needs role editing.
