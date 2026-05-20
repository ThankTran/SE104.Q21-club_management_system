import api from '../utils/api'

export const getNotificationsAPI = () =>
  api.get('notifications')

export const getNotificationByIdAPI = (id) =>
  api.get(`notifications/${id}`)

export const searchNotificationsAPI = (title) =>
  api.get('notifications/search', { params: { title } })

export const getNotificationsByTargetAPI = (targetType) =>
  api.get('notifications/by-target', { params: { targetType } })

export const createNotificationAPI = (payload) =>
  api.post('notifications', payload)

export const deleteNotificationAPI = (id) =>
  api.delete(`notifications/${id}`)

export const createNotificationRecipientAPI = (payload) =>
  api.post('notification-recipients', payload)

export const getNotificationRecipientsAPI = (notificationId) =>
  api.get(`notification-recipients/by-notification/${notificationId}`)

export const getNotificationsByMemberAPI = (memberId) =>
  api.get(`notification-recipients/by-member/${memberId}`)

export const deleteNotificationRecipientAPI = (notificationId, memberId) =>
  api.delete(`notification-recipients/${notificationId}/members/${memberId}`)

// Add mark-as-read endpoint, e.g. PATCH /api/notification-recipients/{notificationId}/members/{memberId}/read.
// Add update notification endpoint if admins can edit sent/draft notifications.
