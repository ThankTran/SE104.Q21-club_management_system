import api from '../utils/api'

export const getDashboardAPI = () =>
  api.get('dashboard')

export const getDashboardStatsAPI = () =>
  api.get('dashboard/stats')

export const getDashboardOverviewAPI = () =>
  api.get('dashboard/overview')

export const getDashboardNotificationsAPI = () =>
  api.get('dashboard/notifications')
