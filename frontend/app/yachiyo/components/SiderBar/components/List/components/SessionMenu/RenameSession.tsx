import { useState, useEffect, memo } from "react";
import { Popup } from "@/components/Popup/Popup";
import { message } from "antd";
import { useUpdateSessionTitle } from "@/hooks/useSessionsData";

export const RenameSession = memo(function RenameSession({
  open,
  onClose,
  id,
  initialTitle,
}: {
  open: boolean;
  onClose: () => void;
  id: string;
  initialTitle: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [submitting, setSubmitting] = useState(false);
  const { mutateAsync: updateSessionTitle } = useUpdateSessionTitle();

  useEffect(() => {
    if (open) setTitle(initialTitle);
  }, [open, initialTitle]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await updateSessionTitle({ id, title: title.trim() });
      message.success("重命名成功");
      onClose();
    } catch {
      message.error("重命名失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Popup open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="bg-[#1a1a2e] rounded-[16px] p-6 w-[360px]">
        <h3 className="text-[#e0e0ec] text-lg mb-4 font-medium">重命名会话</h3>

        <label className="block text-[#8a8aa0] text-[13px] mb-1.5">名称</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入会话名称"
          maxLength={30}
          className="w-full bg-[#0d0d1a] border border-[#323248] rounded-[8px] px-3 py-2 text-[#e0e0ec] text-[14px] mb-1
          outline-none focus:border-[#4e4e78] transition-colors
          placeholder:text-[#5a5a78]"
        />
        <p className="text-[#5a5a78] text-[12px] mb-5 text-right">{title.length}/30</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] text-[14px] text-[#8a8aa0] hover:bg-[#282840] transition-colors">
            取消
          </button>
          <button
            type="submit"
            disabled={!title.trim() || submitting}
            className="px-4 py-2 rounded-[8px] text-[14px] bg-[#4e4e78] text-[#e0e0ec] hover:bg-[#5a5a88]
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {submitting ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </Popup>
  );
});
