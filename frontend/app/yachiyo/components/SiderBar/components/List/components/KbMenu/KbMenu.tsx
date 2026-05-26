import { useState, useRef, useEffect, memo, useCallback } from "react";
import { message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { EditKnowledgeBase } from "./EditKnowledgeBase";

export const KbMenu = memo(function KbMenu({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [menuPosition, setMenuPosition] = useState<"top" | "bottom">("bottom");
  //添加全局监听点击关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);
  //删除知识库逻辑用useCallback保存
  const handleDelete = useCallback(async () => {
    setOpen(false);
    try {
      const res = await fetch(`/api/knowledge-bases?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        message.success("删除成功");
        queryClient.invalidateQueries({ queryKey: ["docBases"] });
      } else {
        message.error(data.message || "删除失败");
      }
    } catch {
      message.error("删除失败");
    }
  }, [id, queryClient]);
  const handleOpen = () => {
    if (ref.current) {
      //获取元素相对于视口的位置和大小
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setMenuPosition(spaceBelow < 150 ? "top" : "bottom");
    }
    setOpen(true);
  };
  return (
    <div ref={ref} className="relative">
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpen();
          setOpen(!open);
        }}
        className="w-[24px] h-[24px] flex items-center justify-center rounded-full hover:bg-[#3a3a5c] text-[#8a8aa0] text-[14px] cursor-pointer mr-[4px]">
        <span>···</span>
      </span>
      {open && (
        <div
          className={`absolute right-0 ${menuPosition === "top" ? "bottom-full mb-[4px]" : "top-full mt-[4px]"}  
                        w-[120px] bg-[#282840] 
                        border border-[#323248] rounded-[8px] p-[4px] z-50`}>
          <div
            className="p-[6px_10px] rounded-[6px] hover:bg-[#323248] cursor-pointer text-[13px] text-[#e0e0ec]"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setEditOpen(true);
            }}>
            修改知识库
          </div>
          <div
            className="p-[6px_10px] rounded-[6px] hover:bg-[#323248] cursor-pointer text-[13px] text-[#e0556a]"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}>
            删除知识库
          </div>
        </div>
      )}
      <EditKnowledgeBase
        open={editOpen}
        onClose={() => setEditOpen(false)}
        id={id}
        initialName={name}
        initialDescription={description || ""}
      />
    </div>
  );
});
