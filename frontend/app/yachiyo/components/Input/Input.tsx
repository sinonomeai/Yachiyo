"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "./components/Button/InputButton";
import { KnowledgeModal } from "./components/KnowledgeModal/KnowledgeModal";
import { useKnowledgeStore } from "@/state/stores/useKnowledgeStore";
import { useDeepThinkingStore } from "@/state/stores/useDeepThinkingStore";
import { useWebSearchingStore } from "@/state/stores/useWebSearchingStore";
interface Input {
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
  status?: string;
  input: string;
  setInput: (value: string | ((prevState: string) => string)) => void;
}
export const Input = ({ onSubmit, status, setInput, input }: Input) => {
  const disabled = input.length === 0 || input.trim() === "";
  const fatherRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  //展开知识库选择列表
  const [modalOpen, setModalOpen] = useState(false);
  //选择知识库
  const { selectedDocumentIds } = useKnowledgeStore();
  //切换思考模式
  const { deepThinking, setThinkingMod } = useDeepThinkingStore();
  //切换搜索模式
  const { webSearching, setSearchingMod } = useWebSearchingStore();
  const hasSelection = selectedDocumentIds.length > 0;
  useEffect(() => {
    const father = fatherRef.current;
    const textarea = textareaRef.current;
    //防御性检查防止组件未挂载、挂载后Ref未绑定或者卸载后报错
    if (!father || !textarea) {
      console.warn("Input component: fatherRef or textareaRef not found");
      return;
    }
    const handleInput = () => {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 300);
      textarea.style.height = newHeight + "px";
      father.style.height = newHeight + "px";
    };
    textareaRef.current?.addEventListener("input", handleInput);
    return () => {
      textareaRef.current?.removeEventListener("input", handleInput);
    };
  }, []);
  //设置输入值
  const inputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  //enter触发提交
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 阻止换行
      if (!disabled && (status === undefined || status === "ready")) {
        // 触发表单提交
        const form = e.currentTarget.form;
        form?.requestSubmit();
      }
    }
  };
  return (
    <div
      className="custom-scrollbar
        w-full flex flex-col 
        bg-[#1e1e2e] text-[#e0e0ec] 
        border border-[#282840] rounded-[12px]">
      {/* 输入 */}
      <form onSubmit={onSubmit}>
        <div className="w-full h-[60px]" ref={fatherRef}>
          <textarea
            className="custom-scrollbar
            w-full h-full resize-none outline-none
            p-[12px_12px_0_16px]
            placeholder:text-[#8a8aa0]"
            aria-label="输入消息"
            placeholder="Link with Yachiyo"
            rows={2}
            name="message"
            ref={textareaRef}
            value={input}
            onChange={inputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        {/* 底部图标 */}
        <div className="h-[58px] p-[16px] flex justify-between gap-[4px]">
          <div className="flex gap-[4px]">
            <div
              className={`h-[30px] pr-[10px] group relative rounded-full
            flex justify-center items-center gap-[4px] cursor-pointer
            transition-colors duration-200 ${
              webSearching ? "bg-[#5b8def]/15 text-[#5b8def]" : "hover:bg-[#282840]"
            }`}
              onClick={() => setSearchingMod(!webSearching)}>
              <Button href="#icon-wangluo" tip="按需搜索网页" type="button" />
              <p className="text-[#8a8aa0] text-xs">智能搜索</p>
            </div>
            <div
              className={`h-[30px] pr-[10px] group relative rounded-full
            flex justify-center items-center gap-[4px] cursor-pointer
            transition-colors duration-200 ${
              deepThinking ? "bg-[#5b8def]/15 text-[#5b8def]" : "hover:bg-[#282840]"
            }`}
              onClick={() => setThinkingMod(!deepThinking)}>
              <Button href="#icon-shendusikao" tip="先思考后回答" type="button" />
              <p className="text-[#8a8aa0] text-xs">深度思考</p>
            </div>
          </div>
          <div className="flex gap-[4px]">
            <div
              className={`h-[30px] w-[30px] group relative rounded-full flex justify-center items-center cursor-pointer transition-colors duration-200 
                ${hasSelection ? "bg-[#5b8def]/15 text-[#5b8def]" : "hover:bg-[#282840] text-[#8a8aa0]"}`}
              onClick={() => setModalOpen(true)}>
              <Button
                className2="!text-[14px]"
                href="#icon-zhiding"
                tip={hasSelection ? `已选 ${selectedDocumentIds.length} 个文档` : "选择知识库"}
                type="button"
              />
            </div>
            <div className="h-[30px] w-[30px] group relative rounded-full flex justify-center items-center cursor-pointer hover:bg-[#282840] transition-colors duration-200">
              <Button href="#icon-fujian" tip="附件" type="button" />
            </div>
            <div
              className={`h-[30px] w-[30px] group relative rounded-full 
             cursor-pointer 
            bg-[#3a3a5c] transition-colors duration-200 
            ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-[#4e4e78] "} `}>
              <Button
                className2="relative left-[2px] top-[-1px]"
                href="#icon-jijianfasong-xianxing"
                tip={disabled ? "请输入消息" : "发送"}
                disabled={disabled || status !== "ready"}
                type="submit"
              />
            </div>
          </div>
        </div>
      </form>
      <KnowledgeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
