import api from '../utils/api'

export const getSystemSettingsAPI = () =>
  api.get('system-settings')

export const getSystemSettingByKeyAPI = (key) =>
  api.get('system-settings/by-key', { params: { key } })

export const saveSystemSettingAPI = (payload) =>
  api.post('system-settings', payload)

export const deleteSystemSettingAPI = (key) =>
  api.delete('system-settings', { params: { key } })

export const getMonthlyDueAmountAPI = () =>
  api.get('system-settings/monthly-due-amount')

export const saveMonthlyDueAmountAPI = (payload) =>
  api.post('system-settings/monthly-due-amount', payload)
