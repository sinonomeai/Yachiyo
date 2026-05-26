import { create } from "zustand";
interface SiderStore {
  isExpanded: boolean;   
  setExpanded: (data: boolean) => void;  
}
//侧边栏展开状态
export const useSiderStore = create<SiderStore>((set) => ({
  isExpanded: true,
  setExpanded: (data: boolean) => set({ isExpanded: data }),
}));