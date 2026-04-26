import { create } from 'zustand'

const useAppStore = create((set) => ({
  isLoading: false,
  setLoading: (val) => set({ isLoading: val }),
}))

export default useAppStore