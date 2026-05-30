import { useState, useEffect } from "react";
import { useUploadDocument } from "@/hooks/useDocBasesData";
import type { UploadTask } from "../page";

interface UploadSectionProps {
  baseId: string;
}

export function UploadSection({ baseId }: UploadSectionProps) {
  const { mutateAsync: upload } = useUploadDocument(baseId);
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [uploading, setUploading] = useState(false);

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const errorCount = tasks.filter((t) => t.status === "error").length;
  const totalCount = tasks.length;

  useEffect(() => {
    if (!uploading && tasks.length > 0 && doneCount + errorCount === totalCount) {
      const timer = setTimeout(() => setTasks([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploading, doneCount, errorCount, tasks.length, totalCount]);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const mdFiles = files.filter((f) => f.name.endsWith(".md"));
    if (mdFiles.length === 0) {
      alert("请选择 .md 格式的文件");
      return;
    }

    const newTasks: UploadTask[] = mdFiles.map((file) => ({
      file,
      status: "pending",
    }));
    setTasks(newTasks);
    setUploading(true);

    for (let i = 0; i < newTasks.length; i++) {
      const task = newTasks[i];

      setTasks((prev) =>
        prev.map((t, idx) =>
          idx === i ? { ...t, status: "uploading" as const } : t,
        ),
      );

      try {
        const text = await task.file.text();
        await upload({
          filename: task.file.name,
          file_type: "md",
          file_size: task.file.size,
          raw_content: text,
        });

        setTasks((prev) =>
          prev.map((t, idx) =>
            idx === i ? { ...t, status: "done" as const } : t,
          ),
        );
      } catch {
        setTasks((prev) =>
          prev.map((t, idx) =>
            idx === i
              ? { ...t, status: "error" as const, error: "上传失败" }
              : t,
          ),
        );
      }
    }

    setUploading(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#8a8aa0] text-[13px]">文档</h2>
        <button className="flex items-center gap-[6px] px-3 py-1.5 rounded-[8px] border border-[#323248] text-[#8a8aa0] text-[13px] hover:bg-[#282840] transition-colors">
          <label className="flex items-center gap-[6px] cursor-pointer">
            <svg
              className="w-[16px] h-[16px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>上传文档（.md）</span>
            <input
              type="file"
              accept=".md,text/markdown"
              multiple
              className="hidden"
              onChange={handleFiles}
              disabled={uploading}
            />
          </label>
        </button>
      </div>

      {tasks.length > 0 && (
        <div className="mb-4 p-[14px] rounded-[10px] bg-[#1e1e34] border border-[#282840]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#e0e0ec] text-[13px]">
              {uploading ? "上传中..." : "上传完成"}
            </span>
            <span className="text-[#8a8aa0] text-[12px]">
              {doneCount}/{totalCount}
            </span>
          </div>
          <div className="w-full h-[4px] bg-[#282840] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#5b8def] rounded-full transition-all duration-300"
              style={{
                width: `${
                  totalCount > 0 ? (doneCount / totalCount) * 100 : 0
                }%`,
              }}
            />
          </div>
          <div className="flex flex-col gap-[4px] max-h-[140px] overflow-y-auto custom-scrollbar">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="flex items-center gap-[8px] text-[12px]">
                {task.status === "uploading" ? (
                  <span className="w-[14px] h-[14px] border-2 border-[#5b8def] border-t-transparent rounded-full animate-spin shrink-0" />
                ) : task.status === "done" ? (
                  <svg
                    className="w-[14px] h-[14px] text-[#34d399] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : task.status === "error" ? (
                  <svg
                    className="w-[14px] h-[14px] text-[#f87171] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <span className="w-[14px] h-[14px] rounded-full border border-[#5a5a78] shrink-0" />
                )}
                <span className="text-[#e0e0ec] truncate flex-1 min-w-0">
                  {task.file.name}
                </span>
                {task.status === "error" && (
                  <span className="text-[#f87171] shrink-0">{task.error}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
