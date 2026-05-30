import { useState, useRef, useEffect, memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { message } from "antd";
import { useRemoveKnowledgeBase } from "@/hooks/useKnowledgeBaseData";
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
  const [menuPosition, setMenuPosition] = useState<"top" | "bottom">("bottom");
  const router = useRouter();
  const pathName = usePathname();
  const { mutateAsync: removeKnowledgeBase } = useRemoveKnowledgeBase();

  // 点击外部关闭菜单
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);
  //删除函数
  const handleDelete = async () => {
    setOpen(false);
    try {
      await removeKnowledgeBase(id);
      message.success("删除成功");
      if (pathName === `/yachiyo/docbase/${id}`) {
        router.replace("/yachiyo/docbase");
      }
    } catch (err: any) {
      message.error(err?.message || "删除失败");
    }
  };
  //根据高度选择展开位置
  const handleOpen = () => {
    if (ref.current) {
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
