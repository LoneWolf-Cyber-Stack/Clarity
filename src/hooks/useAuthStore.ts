import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { useJournalStore } from './useJournalStore';
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
type AuthActions = {
  checkSession: () => Promise<void>;
  login: (email: string) => Promise<void>;
  register: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};
export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    checkSession: async () => {
      set({ isLoading: true });
      try {
        const user = await api<User>('/api/auth/me');
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    },
    login: async (email) => {
      try {
        const user = await api<User>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
        set({ user, isAuthenticated: true });
        toast.success('Logged in successfully!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        toast.error(errorMessage);
        throw error;
      }
    },
    register: async (email) => {
      try {
        const user = await api<User>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
        set({ user, isAuthenticated: true });
        toast.success('Welcome to Clarity!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        toast.error(errorMessage);
        throw error;
      }
    },
    logout: async () => {
      try {
        await api('/api/auth/logout', { method: 'POST' });
        set({ user: null, isAuthenticated: false });
        useJournalStore.getState().clearEntries();
        toast.info('You have been logged out.');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Logout failed';
        toast.error(errorMessage);
      }
    },
  }))
);