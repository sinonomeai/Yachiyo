import { create } from "zustand";
interface SiderStore {
  isExpanded: boolean;   
  setExpanded: (data: boolean) => void;  
}

export const useSiderStore = create<SiderStore>((set) => ({
  isExpanded: true,
  setExpanded: (data: boolean) => set({ isExpanded: data }),
}));