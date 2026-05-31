import { useState, useRef, useEffect } from "react";
import { useRenameDocument, useRemoveDocument } from "@/hooks/useDocBasesData";
import { Popup } from "@/components/Popup/Popup";
import { message } from "antd";

interface DocumentListProps {
  documents: any[];
  isLoading: boolean;
  baseId: string;
}

/** 知识库文档列表：展示、重命名（内联编辑）、删除（弹窗确认） */
export function DocumentList({ documents, isLoading, baseId }: DocumentListProps) {
  // mutateAsync 返回 Promise，便于在事件处理中 await 错误
  const { mutateAsync: rename } = useRenameDocument(baseId);
  const { mutateAsync: remove } = useRemoveDocument(baseId);

  // ---- 重命名相关状态 ----
  //保存编辑文档id
  const [editingId, setEditingId] = useState<string | null>(null);
  //保存编辑文档值
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  // 进入编辑态时自动聚焦输入框
  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);
  // ---- 重命名操作 ----

  /** 进入重命名编辑态 */
  const startRename = (doc: any) => {
    setEditingId(doc.id);
    setEditValue(doc.filename);
  };

  /** 确认重命名并提交 */
  const confirmRename = async () => {
    if (!editingId) return;
    if (!editValue.trim()) return;
    try {
      await rename({ documentId: editingId, filename: editValue.trim() });
      setEditingId(null);
    } catch {
      message.error("重命名失败");
    }
  };

  /** 取消重命名（失焦或 Esc） */
  const cancelRename = () => setEditingId(null);

  /** 重命名输入框键盘事件：Enter 确认，Esc 取消 */
  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") confirmRename();
    if (e.key === "Escape") cancelRename();
  };

  // ---- 删除确认相关状态 ----
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    filename: string;
  } | null>(null);
  // ---- 删除操作 ----

  /** 确认删除并提交 */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      message.error("删除失败");
    }
  };

  // 加载态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-[#8a8aa0] text-[14px]">加载中...</span>
      </div>
    );
  }

  // 空态
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#5a5a78]">
        <svg
          className="w-[40px] h-[40px] mb-3 opacity-30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <p className="text-[14px]">暂无文档，点击上方按钮上传</p>
      </div>
    );
  }

  return (
    <>
      {/* 文档列表 */}
      <div className="flex flex-col gap-[2px]">
        {documents.map((doc: any) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 p-[10px_14px] rounded-[10px] hover:bg-[#282840] transition-colors group">
            {/* 文件图标 */}
            <div className="w-[36px] h-[36px] rounded-[8px] bg-[#282840] flex items-center justify-center shrink-0">
              <svg
                className="w-[18px] h-[18px] text-[#8a8aa0]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>

            {/* 文档信息：编辑态 / 展示态 */}
            <div className="flex-1 min-w-0">
              {editingId === doc.id ? (
                <input
                  ref={editInputRef}
                  className="bg-[#14141f] border border-[#5b8def] rounded-[6px] px-[8px] py-[2px] text-[#e0e0ec] text-[14px] w-full outline-none"
                  value={editValue}
                  placeholder="输入新名称"
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={cancelRename}
                  onKeyDown={handleRenameKeyDown}
                />
              ) : (
                <p className="text-[#e0e0ec] text-[14px] truncate">{doc.filename}</p>
              )}
              {/* 文件元信息：类型 · 大小 · 分块数 */}
              <p className="text-[#5a5a78] text-[12px]">
                {doc.file_type?.toUpperCase() ?? ""}
                {doc.file_size ? ` · ${formatFileSize(doc.file_size)}` : ""}
                {doc.total_chunks != null ? ` · ${doc.total_chunks} 块` : ""}
              </p>
            </div>

            {/* 上传时间 */}
            <span className="text-[#5a5a78] text-[12px] shrink-0">
              {formatDate(doc.created_at)}
            </span>

            {/* 操作按钮：hover 时显示 */}
            <div className="flex items-center gap-[4px] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-[4px] rounded-[6px] hover:bg-[#323248] text-[#8a8aa0] hover:text-[#e0e0ec] transition-colors"
                title="重命名"
                onClick={() => startRename(doc)}>
                <svg
                  className="w-[15px] h-[15px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </button>
              <button
                className="p-[4px] rounded-[6px] hover:bg-[#323248] text-[#8a8aa0] hover:text-[#f87171] transition-colors"
                title="删除"
                onClick={() => setDeleteTarget({ id: doc.id, filename: doc.filename })}>
                <svg
                  className="w-[15px] h-[15px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 删除确认弹窗 */}
      <Popup open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <div className="bg-[#1a1a2e] rounded-[16px] p-6 w-[380px]">
          <h3 className="text-[#e0e0ec] text-lg mb-2 font-medium">确认删除</h3>
          <p className="text-[#8a8aa0] text-[14px] mb-6">
            确定要删除文档{" "}
            <span className="text-[#e0e0ec] font-medium">「{deleteTarget?.filename}」</span>{" "}
            吗？此操作不可撤销。
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-[8px] text-[14px] text-[#8a8aa0] hover:bg-[#282840] transition-colors">
              取消
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 rounded-[8px] text-[14px] bg-[#f87171]/15 text-[#f87171] hover:bg-[#f87171]/25 transition-colors">
              确认删除
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
}

/** 文件大小格式化：B → KB → MB */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** 日期格式化：今天 / 昨天 / N 天前 / 本地日期 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  return date.toLocaleDateString("zh-CN");
}
