import { create } from "zustand";
interface SiderStore {
  isExpanded: boolean;      // 更语义化
  setExpanded: (data: boolean) => void;  // 大写 S
}

export const useSiderStore = create<SiderStore>((set) => ({
  isExpanded: true,
  setExpanded: (data: boolean) => set({ isExpanded: data }),
}));