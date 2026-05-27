import { create } from 'zustand';
import {persist} from 'zustand/middleware';
import { isManager } from '../utils/access-control';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      login: (user, token) => {
        set({
          user,
          token,
          isLoggedIn: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        });
      },

      updateUser: (updatedFields) => {
        set((state) => ({
          user: state.user ?{
            ...state.user,
            ...updatedFields
          }: null,
        }));
      },

      // admin / member
      isAdmin: () => isManager(get().user),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;
