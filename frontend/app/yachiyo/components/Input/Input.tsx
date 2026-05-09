import { useEffect, useRef } from "react";
import { InputButton } from "./InputButton/InputButton";
export const Input = () => {
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
        w-full flex flex-col 
        bg-[#1e1e2e] text-[#e0e0ec] 
        border border-[#282840] rounded-[12px]">
      <div className="w-full h-[60px]" ref={fatherRef}>
        <textarea
          className="custom-scrollbar
          font-upheaval 
            w-full h-full resize-none outline-none
            p-[12px_12px_0_16px]
            placeholder:text-[#8a8aa0]"
          aria-label="输入消息"
          placeholder="Link with Yachiyo"
          rows={2}
          name="message"
          ref={textareaRef}
        />
      </div>

      <div className="h-[58px] p-[16px] flex justify-between gap-[4px]">
        <div className="flex gap-[4px]">
          <div className="h-[30px] px-[10px] group relative rounded-full flex justify-center items-center gap-[4px] cursor-pointer hover:bg-[#282840] transition-colors duration-200">
            <InputButton href="#icon-wangluo" tip="按需搜索网页" />
            <p className="text-[#8a8aa0] text-xs">智能搜索</p>
          </div>
          <div className="h-[30px] px-[10px] group relative rounded-full flex justify-center items-center gap-[4px] cursor-pointer hover:bg-[#282840] transition-colors duration-200">
            <InputButton href="#icon-shendusikao" tip="先思考后回答" />
            <p className="text-[#8a8aa0] text-xs">深度思考</p>
          </div>
        </div>
        <div className="flex gap-[4px]">
          <div className="h-[30px] w-[30px] group relative rounded-full flex justify-center items-center cursor-pointer hover:bg-[#282840] transition-colors duration-200">
            <InputButton
              className2="!text-[14px]"
              href="#icon-zhiding"
              tip="选择知识库"
            />
          </div>
          <div className="h-[30px] w-[30px] group relative rounded-full flex justify-center items-center cursor-pointer hover:bg-[#282840] transition-colors duration-200">
            <InputButton href="#icon-fujian" tip="附件" />
          </div>
          <div className="h-[30px] w-[30px] group relative rounded-full flex justify-center items-center cursor-pointer bg-[#3a3a5c] hover:bg-[#4e4e78] transition-colors duration-200">
            <InputButton
              className2="relative left-[2px] top-[-1px]"
              href="#icon-jijianfasong-xianxing"
              tip="请输入消息"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
