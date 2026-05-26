import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DeepThinkingStore {
  deepThinking: boolean;
  setThinkingMod: (data:boolean) => void;
}
//保存深度思考模式
export const useDeepThinkingStore = create<DeepThinkingStore>()(
  persist(
    (set) => ({
      deepThinking: false,
      setThinkingMod: (data: boolean) => set({ deepThinking: data }),
    }),
    {
      name: "deepThinking-trigger",
    },
  ),
);
