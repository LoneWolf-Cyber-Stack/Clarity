import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { JournalEntry } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { useAuthStore } from './useAuthStore';
type JournalState = {
  entries: JournalEntry[];
  selectedEntryId: string | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
};
type JournalActions = {
  fetchEntries: () => Promise<void>;
  selectEntry: (id: string | null) => void;
  createNewEntry: () => Promise<void>;
  updateEntry: (id: string, title: string, content: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntryById: (id: string | null) => JournalEntry | undefined;
  clearEntries: () => void;
};
export const useJournalStore = create<JournalState & JournalActions>()(
  immer((set, get) => ({
    entries: [],
    selectedEntryId: null,
    isLoading: true,
    error: null,
    isSaving: false,
    fetchEntries: async () => {
      if (!useAuthStore.getState().isAuthenticated) {
        set({ isLoading: false, entries: [] });
        return;
      }
      set({ isLoading: true, error: null });
      try {
        const entries = await api<JournalEntry[]>('/api/journal');
        set((state) => {
          state.entries = entries;
          state.isLoading = false;
          if (!state.selectedEntryId && entries.length > 0) {
            state.selectedEntryId = entries[0].id;
          } else if (entries.length === 0) {
            state.selectedEntryId = null;
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch entries';
        set({ isLoading: false, error: errorMessage });
        toast.error(errorMessage);
      }
    },
    selectEntry: (id) => {
      set({ selectedEntryId: id });
    },
    createNewEntry: async () => {
      set({ isSaving: true });
      try {
        const newEntry = await api<JournalEntry>('/api/journal', {
          method: 'POST',
          body: JSON.stringify({ title: 'New Entry', content: '' }),
        });
        set((state) => {
          state.entries.unshift(newEntry);
          state.selectedEntryId = newEntry.id;
          state.isSaving = false;
        });
        toast.success('New entry created');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create entry';
        set({ isSaving: false });
        toast.error(errorMessage);
      }
    },
    updateEntry: async (id, title, content) => {
      set({ isSaving: true });
      try {
        const updatedEntry = await api<JournalEntry>(`/api/journal/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, content }),
        });
        set((state) => {
          const index = state.entries.findIndex((e) => e.id === id);
          if (index !== -1) {
            state.entries[index] = updatedEntry;
          }
          // Re-sort entries to bring the updated one to the top
          state.entries.sort((a, b) => b.updatedAt - a.updatedAt);
          state.isSaving = false;
        });
        // toast.success('Entry saved'); // This can be too noisy with auto-save
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save entry';
        set({ isSaving: false });
        toast.error(errorMessage);
      }
    },
    deleteEntry: async (id) => {
      try {
        await api(`/api/journal/${id}`, { method: 'DELETE' });
        set((state) => {
          state.entries = state.entries.filter((e) => e.id !== id);
          if (state.selectedEntryId === id) {
            state.selectedEntryId = state.entries.length > 0 ? state.entries[0].id : null;
          }
        });
        toast.success('Entry deleted');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete entry';
        toast.error(errorMessage);
      }
    },
    getEntryById: (id) => {
      if (!id) return undefined;
      return get().entries.find((e) => e.id === id);
    },
    clearEntries: () => {
      set({ entries: [], selectedEntryId: null, isLoading: false });
    },
  }))
);