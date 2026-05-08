import useAuthStore from '../store/auth-store'

export const getToken = () => useAuthStore.getState().token
export const removeToken = () => useAuthStore.getState().logout()
export const hasToken = () => !!useAuthStore.getState().token