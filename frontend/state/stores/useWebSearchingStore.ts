import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WebSearchingStore {
  webSearching: boolean;
  setSearchingMod: (data: boolean) => void;
}
//保存深度思考模式
export const useWebSearchingStore = create<WebSearchingStore>()(
  persist(
    (set) => ({
      webSearching: false,
      setSearchingMod: (data: boolean) => set({ webSearching: data }),
    }),
    {
      name: "webSearching-trigger",
    },
  ),
);
