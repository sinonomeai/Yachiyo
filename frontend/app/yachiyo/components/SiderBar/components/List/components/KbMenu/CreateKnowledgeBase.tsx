import { useState } from "react";
import { Popup } from "@/components/Popup/Popup";
import { message } from "antd";
import { useCreateKnowledgeBase } from "@/hooks/useKnowledgeBaseData";

export function CreateKnowledgeBase({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutateAsync: create, isPending: submitting } = useCreateKnowledgeBase();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;

    try {
      await create({ name: name.trim(), description: description.trim() });
      message.success("创建成功");
      onClose();
      setName("");
      setDescription("");
    } catch (err: any) {
      message.error(err?.message || "创建失败");
    }
  };

  return (
    <Popup open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="bg-[#1a1a2e] rounded-[16px] p-6 w-[400px]">
        <h3 className="text-[#e0e0ec] text-lg mb-4 font-medium">创建知识库</h3>

        <label className="block text-[#8a8aa0] text-[13px] mb-1.5">名称</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入知识库名称"
          maxLength={10}
          className="w-full bg-[#0d0d1a] border border-[#323248] rounded-[8px] px-3 py-2 text-[#e0e0ec] text-[14px] mb-1
          outline-none focus:border-[#4e4e78] transition-colors
          placeholder:text-[#5a5a78]"
        />
        <p className="text-[#5a5a78] text-[12px] mb-4 text-right">{name.length}/10</p>

        <label className="block text-[#8a8aa0] text-[13px] mb-1.5">描述（可选）</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="简要描述知识库内容"
          maxLength={20}
          rows={2}
          className="w-full bg-[#0d0d1a] border border-[#323248] rounded-[8px] px-3 py-2 text-[#e0e0ec] text-[14px] mb-1
          outline-none focus:border-[#4e4e78] transition-colors resize-none
          placeholder:text-[#5a5a78]"
        />
        <p className="text-[#5a5a78] text-[12px] mb-5 text-right">{description.length}/20</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] text-[14px] text-[#8a8aa0] hover:bg-[#282840] transition-colors">
            取消
          </button>
          <button
            type="submit"
            disabled={!name.trim() || submitting}
            className="px-4 py-2 rounded-[8px] text-[14px] bg-[#4e4e78] text-[#e0e0ec] hover:bg-[#5a5a88]
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {submitting ? "创建中..." : "创建"}
          </button>
        </div>
      </form>
    </Popup>
  );
}
