import { useState, useRef, useEffect, memo, useCallback } from "react";
import { message } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useRemoveSession } from "@/hooks/useSessionsData";
import { RenameSession } from "./RenameSession";

export const SessionMenu = memo(function SessionMenu({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<"top" | "bottom">("bottom");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathName = usePathname();
  const { mutateAsync: removeSession } = useRemoveSession();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  const handleDelete = useCallback(async () => {
    setOpen(false);
    try {
      await removeSession(id);
      message.success("删除成功");
      if (pathName === `/yachiyo/chat/${id}`) {
        router.push("/yachiyo");
      }
    } catch {
      message.error("删除失败");
    }
  }, [id, pathName, removeSession, router]);

  const handleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setMenuPosition(spaceBelow < 150 ? "top" : "bottom");
    }
    setOpen(true);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpen();
        }}
        className="w-[24px] h-[24px] flex items-center justify-center rounded-full
        hover:bg-[#3a3a5c] text-[#8a8aa0] text-[14px] cursor-pointer mr-[4px] select-none">
        <span>···</span>
      </span>
      {open && (
        <div
          className={`absolute right-0 ${
            menuPosition === "top" ? "bottom-full mb-[4px]" : "top-full mt-[4px]"
          } w-[100px] bg-[#282840] border border-[#323248] rounded-[8px] p-[4px] z-50`}>
          <div
            className="p-[6px_10px] rounded-[6px] hover:bg-[#323248] cursor-pointer text-[13px] text-[#e0e0ec]"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setRenameOpen(true);
            }}>
            重命名
          </div>
          <div
            className="p-[6px_10px] rounded-[6px] hover:bg-[#323248] cursor-pointer text-[13px] text-[#e0556a]"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}>
            删除
          </div>
        </div>
      )}
      <RenameSession
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        id={id}
        initialTitle={title}
      />
    </div>
  );
});
