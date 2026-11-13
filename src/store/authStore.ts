import { create } from 'zustand';
import type { User } from '../types';
import { authApi } from '../api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionTerminatedModal: boolean;
  setSessionTerminatedModal: (show: boolean) => void;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateUserAccess: (courseAccess: boolean, paymentStatus: 'PENDING' | 'COMPLETED' | 'FREE') => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken = localStorage.getItem('jm_token');
  const storedUser = localStorage.getItem('jm_user');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: initialToken,
    isAuthenticated: !!initialToken,
    isLoading: false,
    sessionTerminatedModal: false,

    setSessionTerminatedModal: (show: boolean) => set({ sessionTerminatedModal: show }),

    login: (token: string, user: User) => {
      const fullAccessUser = { ...user, courseAccess: true };
      localStorage.setItem('jm_token', token);
      localStorage.setItem('jm_user', JSON.stringify(fullAccessUser));
      set({ token, user: fullAccessUser, isAuthenticated: true, sessionTerminatedModal: false });
    },

    logout: async () => {
      try {
        await authApi.logout();
      } catch (ignored) {}
      localStorage.removeItem('jm_token');
      localStorage.removeItem('jm_user');
      set({ token: null, user: null, isAuthenticated: false });
    },

    updateUserAccess: (courseAccess: boolean, paymentStatus: 'PENDING' | 'COMPLETED' | 'FREE') => {
      const current = get().user;
      if (current) {
        const updated = { ...current, courseAccess: true, paymentStatus };
        localStorage.setItem('jm_user', JSON.stringify(updated));
        set({ user: updated });
      }
    },

    fetchCurrentUser: async () => {
      if (!get().token) return;
      try {
        set({ isLoading: true });
        const user = await authApi.getMe();
        const fullAccessUser = { ...user, courseAccess: true };
        localStorage.setItem('jm_user', JSON.stringify(fullAccessUser));
        set({ user: fullAccessUser, isAuthenticated: true });
      } catch (err) {
        // If expired or invalid
        localStorage.removeItem('jm_token');
        localStorage.removeItem('jm_user');
        set({ user: null, token: null, isAuthenticated: false });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

// Listen for single-session termination event dispatched by axios interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('single-session-terminated', () => {
    useAuthStore.getState().setSessionTerminatedModal(true);
  });
}
