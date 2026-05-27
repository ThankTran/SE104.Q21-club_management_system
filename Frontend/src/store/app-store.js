import { create } from 'zustand'

const DEFAULT_NOTIFICATION_DURATION = 3000

const useAppStore = create((set, get) => ({
  isLoading: false,
  notification: null,

  setLoading: (val) => set({ isLoading: val }),

  setNotification: (
    message,
    type = 'info',
    duration = DEFAULT_NOTIFICATION_DURATION
  ) => {
    const notification = {
      id: Date.now(),
      message,
      type,
    }

    set({ notification })

    if (duration > 0) {
      setTimeout(() => {
        if (get().notification?.id === notification.id) {
          set({ notification: null })
        }
      }, duration)
    }
  },

  clearNotification: () => set({ notification: null }),
}))

export default useAppStore
