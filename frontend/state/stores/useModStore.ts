import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ModStore {
  isChat: boolean;
  setIsChat: (data: boolean) => void;
}
//切换知识库与问答模式
export const useModStore = create<ModStore>()(
  persist(
    (set) => ({
      isChat: true,
      setIsChat: (data: boolean) => set({ isChat: data }),
    }),
    {
      name: "mod-storage",
    },
  ),
);
