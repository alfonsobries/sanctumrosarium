import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SessionPlan } from './session';

type SessionState = {
  plan: SessionPlan | null;
  position: number;
  /** Seconds spent with the prayer screen open, excluding time in the background. */
  activeSeconds: number;
  begin: (plan: SessionPlan) => void;
  moveTo: (position: number) => void;
  addActiveSeconds: (seconds: number) => void;
  clear: () => void;
};

/** The Rosary in progress; survives the app being closed so it can be resumed. */
export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      plan: null,
      position: 0,
      activeSeconds: 0,
      begin: (plan) => set({ plan, position: 0, activeSeconds: 0 }),
      moveTo: (position) => set({ position: Math.max(0, position) }),
      addActiveSeconds: (seconds) => set((state) => ({ activeSeconds: state.activeSeconds + seconds })),
      clear: () => set({ plan: null, position: 0, activeSeconds: 0 }),
    }),
    {
      name: 'session',
      version: 1,
      storage: createJSONStorage(() => Storage),
      partialize: ({ plan, position, activeSeconds }) => ({ plan, position, activeSeconds }),
    },
  ),
);
