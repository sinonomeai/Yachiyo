"use client";
import { SiderLogin } from "../SiderLogin/SiderLogin";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@/components/Icon/Icon";
export const SiderBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAutoControl, setIsAutoControl] = useState(true);
  const isExpandedRef = useRef(isExpanded);
  const isAutoControlRef = useRef(isAutoControl);
  isAutoControlRef.current = isAutoControl;
  isExpandedRef.current = isExpanded;

  const toggleSidebar = () => {
    if (isExpanded) {
      setIsAutoControl(false);
    } else {
      setIsAutoControl(true);
    }
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      console.log(isAutoControlRef.current, isExpanded);
      if (!isAutoControlRef.current) return;
      if (window.innerWidth < 1024 && isExpandedRef.current) {
        setIsExpanded(false);
      }
      if (window.innerWidth > 1024 && !isExpandedRef.current) {
        setIsExpanded(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {/* 侧边栏缩回时悬浮按钮 */}
      <div
        className={`${isExpanded ? "opacity-0 pointer-events-none " : "opacity-100"} 
        transition-all duration-1000 ease-in-out  
        absolute z-10 
        mt-[12px] ml-[16px] 
        h-[40px]
        flex items-center justify-center`}>
        <div
          onClick={toggleSidebar}
          className="w-[30px] h-[30px] cursor-pointer relative  hover:bg-[#282840] rounded-[4px]">
          <Icon
            href="#icon-shouqi"
            className="rotate-180 text-[30px] 
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
          />
        </div>
        <div className="w-[30px] h-[30px] cursor-pointer relative hover:bg-[#282840] rounded-[4px]">
          <Icon
            href="#icon-foller"
            className="text-[25px] 
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
          />
        </div>
      </div>
      {/* 侧边栏 */}
      <div
        className={`${isExpanded ? "w-[260px]" : "w-0"} relative z-20 transition-all duration-400 ease-in-out h-full overflow-hidden bg-[#1a1a2e] border-r border-[#282840] text-[#8a8aa0]`}>
        <div className="h-full w-full p-[6px_12px_10px] flex flex-col justify-between">
          {/* 侧边栏头部 */}
          <div className="flex justify-between h-[50px] p-[15px_0_10px_4px] mb-[16px]">
            <p className="font-pixel text-[#e0e0ec] text-[25px] tracking-[8px] relative top-[-4px]">
              Yachiyo
            </p>
            <div
              onClick={toggleSidebar}
              className="w-[34px] h-[34px] cursor-pointer relative hover:bg-[#282840] rounded-[4px]">
              <Icon
                href="#icon-shouqi"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[30px] "
              />
            </div>
          </div>
          {/* 个人知识库 */}
          <div
            className="truncate h-[42px] flex items-center gap-[10px] 
            mt-[20px] hover:bg-[#282840] p-[9px_6px_9px_10px] rounded-[12px] cursor-pointer">
            <span>个人知识库</span>
            <div>
              <Icon href="#icon-tushu" className="text-[22px] " />
            </div>
          </div>
          {/* 新对话以及历史记录 */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div
              className="truncate
              h-[42px]  
              flex items-center gap-[10px] 
              mb-[12px]  hover:bg-[#282840] p-[9px_6px_9px_10px] rounded-[12px] cursor-pointer">
              <p>开启新对话</p>
              <div>
                <Icon href="#icon-foller" className="text-[22px] " />
              </div>
            </div>
            <div className=" flex-1 min-h-0 pt-[12px] border-t ">
              <ul className="custom-scrollbar h-full pr-[5px] cursor-pointer overflow-y-auto">
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录一ddddddddddddddddddddddddddddddddddddddddddddddd
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录二
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录三
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录四
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录五
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录一ddddddddddddddddddddddddddddddddddddddddddddddd
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录二
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录四
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录五
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录一ddddddddddddddddddddddddddddddddddddddddddddddd
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录二
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录五
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录一ddddddddddddddddddddddddddddddddddddddddddddddd
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录二
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录一ddddddddddddddddddddddddddddddddddddddddddddddd
                </li>
                <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                  历史记录二
                </li>
              </ul>
            </div>
          </div>
          {/* 侧边栏底部登录设置等按钮 */}
          <div className="h-[44px] relative">
            <SiderLogin />
          </div>
        </div>
      </div>
    </>
  );
};
