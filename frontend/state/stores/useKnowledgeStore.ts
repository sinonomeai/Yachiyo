import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KnowledgeStore {
  selectedBaseId: string | null;
  selectedDocumentIds: string[];
  setSelection: (baseId: string | null, documentIds: string[]) => void;
  clearSelection: () => void;
}
//保存选择知识库状态
export const useKnowledgeStore = create<KnowledgeStore>()(
  persist(
    (set) => ({
      selectedBaseId: null,
      selectedDocumentIds: [],
      setSelection: (baseId, documentIds) =>
        set({ selectedBaseId: baseId, selectedDocumentIds: documentIds }),
      clearSelection: () =>
        set({ selectedBaseId: null, selectedDocumentIds: [] }),
    }),
    {
      name: "knowledge-selection",
    },
  ),
);
