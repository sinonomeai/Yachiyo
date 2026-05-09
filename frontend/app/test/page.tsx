"use client";
import { useEffect, useRef } from "react";
export default function Input() {
  const fatherRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  return (

    <div
      className="custom-scrollbar
        w-[880px] flex flex-col 
        bg-[#1e1e2e] text-[#e0e0ec] 
        border border-[#282840] rounded-[12px]">
      <div className="w-full h-[60px]" ref={fatherRef}>
        <textarea
          className="font-upheaval 
            w-full h-full resize-none outline-none
            p-[12px_12px_0_16px]
            placeholder:text-[#8a8aa0]"
          aria-label="输入消息"
          placeholder="与yachiyo建立链接"
          rows={2}
          name="message"
          ref={textareaRef}
        />
      </div>

      <div className="h-[58px] p-[16px]">1111</div>
    </div>
  );
}
