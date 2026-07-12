import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type HistoryEntry = {
  id: string;
  expression: string;
  result: string;
  at: number;
};

interface HistoryState {
  entries: HistoryEntry[];
  add: (expression: string, result: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useHistory = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      add: (expression, result) =>
        set((s) => ({
          entries: [
            { id: `${Date.now()}-${Math.random()}`, expression, result, at: Date.now() },
            ...s.entries,
          ].slice(0, 100),
        })),
      remove: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: 'calc-history',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);