import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Session {
  id: string;
  title: string;
  createdAt: Date;
}

interface ListStore {
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
  removeSession: (id: string) => void;
  updateSessionTitle: (id: string, title: string) => void;
}

export const useListStore = create<ListStore>()(
  persist(
    (set) => ({
      sessions: [],
      setSessions: (sessions) => set({ sessions: sessions }),
      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
        })),
      removeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),
      updateSessionTitle: (id, title) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, title } : s,
          ),
        })),
    }),
    {
      name: "sessions-storage", // localStorage 的 key
    },
  ),
);
