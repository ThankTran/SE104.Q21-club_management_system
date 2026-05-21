import api from '../utils/api'

export const loginAPI = (credentials) =>
  api.post('auth/login', credentials)

export const getMeAPI = () =>
  api.get('auth/me')

export const logoutAPI = () =>
  api.post('auth/logout')

export const registerAPI = (credentials) =>
  api.post('auth/register', credentials)

// Chưa có AuthController cho /api/auth/login, /api/auth/me,
// /api/auth/logout, /api/auth/register. 
