"use client";
import { useState, useEffect } from "react";
import { Popup } from "@/components/Popup/Popup";
import { useDocBases, useDocuments } from "@/hooks/useDocBasesData";
import { useKnowledgeStore } from "@/state/stores/useKnowledgeStore";

interface KnowledgeModalProps {
  open: boolean;
  onClose: () => void;
}

export const KnowledgeModal = ({ open, onClose }: KnowledgeModalProps) => {
  const { data: docBases = [] } = useDocBases();
  const store = useKnowledgeStore();

  const [tempBaseId, setTempBaseId] = useState<string | null>(null);
  const [tempDocIds, setTempDocIds] = useState<string[]>([]);

  const { data: documents = [] } = useDocuments(tempBaseId);

  useEffect(() => {
    if (open) {
      setTempBaseId(store.selectedBaseId);
      setTempDocIds([...store.selectedDocumentIds]);
    }
  }, [open]);

  const toggleDoc = (docId: string) => {
    setTempDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId],
    );
  };

  const toggleAll = () => {
    if (documents.length === 0) return;
    if (tempDocIds.length === documents.length) {
      setTempDocIds([]);
    } else {
      setTempDocIds(documents.map((d: any) => d.id));
    }
  };

  const handleConfirm = () => {
    store.setSelection(tempBaseId, tempDocIds);
    onClose();
  };

  const selectedKb = docBases.find((kb: any) => kb.id === tempBaseId);

  return (
    <Popup open={open} onClose={onClose}>
      <div className="w-[720px] h-[480px] bg-[#1a1a2e] rounded-[16px] border border-[#282840] flex flex-col overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#282840] shrink-0">
          <h3 className="text-[#e0e0ec] text-[15px] font-medium">选择知识库</h3>
          <button
            className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center text-[#8a8aa0] hover:bg-[#282840] hover:text-[#e0e0ec] transition-colors"
            onClick={onClose}
            aria-label="关闭">
            <svg
              className="w-[16px] h-[16px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 主体两栏 */}
        <div className="flex flex-1 min-h-0">
          {/* 左栏：知识库列表 */}
          <div className="w-[40%] border-r border-[#282840] overflow-y-auto custom-scrollbar p-[12px]">
            {docBases.length === 0 ? (
              <p className="text-[#5a5a78] text-[13px] text-center mt-8">暂无知识库</p>
            ) : (
              docBases.map((kb: any) => (
                <button
                  key={kb.id}
                  className={`w-full text-left px-[12px] py-[10px] rounded-[8px] mb-[4px] transition-colors ${
                    tempBaseId === kb.id
                      ? "bg-[#5b8def]/15 border border-[#5b8def]/30"
                      : "hover:bg-[#282840] border border-transparent"
                  }`}
                  onClick={() => {
                    setTempBaseId(kb.id);
                    setTempDocIds([]);
                  }}>
                  <p className="text-[#e0e0ec] text-[13px] truncate">{kb.name}</p>
                  <p className="text-[#5a5a78] text-[11px] mt-[2px]">
                    {kb.description || "暂无描述"}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* 右栏：文档列表 */}
          <div className="w-[60%] flex flex-col min-h-0">
            <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-[#282840] shrink-0">
              <span className="text-[#8a8aa0] text-[12px]">
                {tempBaseId
                  ? `${selectedKb?.name ?? ""} · ${documents.length} 个文档`
                  : "请选择知识库"}
              </span>
              {tempBaseId && documents.length > 0 && (
                <button className="text-[#5b8def] text-[12px] hover:underline" onClick={toggleAll}>
                  {tempDocIds.length === documents.length ? "取消全选" : "全选"}
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-[8px]">
              {!tempBaseId ? (
                <p className="text-[#5a5a78] text-[13px] text-center mt-16">在左侧选择一个知识库</p>
              ) : documents.length === 0 ? (
                <p className="text-[#5a5a78] text-[13px] text-center mt-16">该知识库暂无文档</p>
              ) : (
                documents.map((doc: any) => {
                  const checked = tempDocIds.includes(doc.id);
                  return (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-[10px] px-[12px] py-[10px] mt-1 rounded-[8px] cursor-pointer transition-colors ${
                        checked ? "bg-[#5b8def]/10" : "hover:bg-[#282840]"
                      }`}>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={checked}
                        onChange={() => toggleDoc(doc.id)}
                      />
                      <span
                        className={`w-[16px] h-[16px] rounded-[4px] shrink-0 flex items-center justify-center border transition-colors cursor-pointer ${
                          checked
                            ? "bg-[#5b8def] border-[#5b8def]"
                            : "bg-transparent border-[#3a3a5c] hover:border-[#5b8def]/50"
                        }`}
                        aria-hidden="true">
                        {checked && (
                          <svg
                            className="w-[11px] h-[11px] text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[#e0e0ec] text-[13px] truncate">{doc.filename}</p>
                        <p className="text-[#5a5a78] text-[11px]">
                          {doc.file_type?.toUpperCase() ?? ""}
                          {doc.total_chunks != null ? ` · ${doc.total_chunks} 块` : ""}
                        </p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-between px-[20px] py-[14px] border-t border-[#282840] shrink-0">
          <span className="text-[#8a8aa0] text-[12px]">
            {tempDocIds.length > 0 ? `已选 ${tempDocIds.length} 个文档` : "未选择文档"}
          </span>
          <div className="flex gap-[8px]">
            <button
              className="px-[16px] py-[6px] rounded-[8px] text-[13px] text-[#8a8aa0] hover:bg-[#282840] transition-colors"
              onClick={onClose}>
              取消
            </button>
            <button
              className="px-[16px] py-[6px] rounded-[8px] text-[13px] bg-[#5b8def] text-white hover:bg-[#4a7de0] transition-colors"
              onClick={handleConfirm}>
              确认
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};
