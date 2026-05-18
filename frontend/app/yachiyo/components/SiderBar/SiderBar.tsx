"use client";
import { SiderLogin } from "../SiderLogin/SiderLogin";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@/components/Icon/Icon";
import { useSiderStore } from "@/state/stores/useSiderStore";
import { useListStore } from "@/state/stores/useListStore";
import styles from "../../yachiyo.module.css";
import Link from "next/link";

export const SiderBar = () => {
  //会话列表状态
  const { sessions, setSessions } = useListStore();
  //展开状态
  const { isExpanded, setExpanded } = useSiderStore();
  //根据用户操作判断是否自动搜索
  const [isAutoControl, setIsAutoControl] = useState(true);
  const isExpandedRef = useRef(isExpanded);
  const isAutoControlRef = useRef(isAutoControl);
  isAutoControlRef.current = isAutoControl;
  isExpandedRef.current = isExpanded;
  //按钮切换函数
  const toggleSidebar = () => {
    if (isExpanded) {
      setIsAutoControl(false);
    } else {
      setIsAutoControl(true);
    }
    setExpanded(!isExpanded);
  };
  // 自动随屏幕收缩
  useEffect(() => {
    const handleResize = () => {
      console.log(isAutoControlRef.current, isExpanded);
      if (!isAutoControlRef.current) return;
      if (window.innerWidth < 1024 && isExpandedRef.current) {
        setExpanded(false);
      }
      if (window.innerWidth > 1024 && !isExpandedRef.current) {
        setExpanded(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    async function getList() {
      try {
        const listRes = await fetch("/api/initialData/getList");
        const listData = await listRes.json();

        if (listData.success && listData.sessions) {
          const formattedSessions = listData.sessions.map((session: any) => ({
            id: session.id,
            title: session.title,
            createdAt: new Date(session.created_at),
          }));

          setSessions(formattedSessions);
          console.log("会话列表已加载:", formattedSessions.length);
        }
      } catch (err) {
        console.error("获取会话列表失败:", err);
      }
    }
    getList();
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
        flex items-center gap-[12px]`}>
        <div onClick={toggleSidebar} className="cursor-pointer hidden md:block">
          <img
            src="/Logo.png"
            alt="Yachiyo"
            className="h-[30px] w-auto object-contain
            drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]
            "
          />
        </div>
        <div className="w-[1px] h-[28px] bg-[#4e4e78] hidden md:block" />
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
          <Link href="/yachiyo">
            <Icon
              href="#icon-foller"
              className="text-[25px]
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
            />
          </Link>
        </div>
      </div>
      {/* 侧边栏 */}
      <div
        className={`${isExpanded ? "w-[260px]" : "w-0"} 
        md:relative
        absolute 
        z-20 text-[#8a8aa0]
        transition-all duration-400 
        ease-in-out h-full overflow-hidden 
        bg-[#1a1a2e] text-[#8a8aa0]
        border-r border-[#282840]`}>
        <div className="h-full w-full p-[6px_12px_10px] flex flex-col justify-between">
          {/* 侧边栏头部 */}
          <div className="flex justify-between h-[50px] p-[15px_0_10px_4px] mb-[16px]">
            <div className="flex items-center">
              <img
                src="/Logo.png"
                alt="Yachiyo"
                className="h-[40px] w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
              />
            </div>
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
            <div className="truncate">
              <Link
                className="h-[42px]  
              flex items-center gap-[10px] 
              mb-[12px]  hover:bg-[#282840] p-[9px_6px_9px_10px] rounded-[12px] cursor-pointer"
                href="/yachiyo">
                <p>开启新对话</p>
                <div>
                  <Icon href="#icon-foller" className="text-[22px] " />
                </div>
              </Link>
            </div>
            <div className={`${styles.historyList} flex-1 min-h-0 pt-[12px] border-t`}>
              <ul className="custom-scrollbar h-full pr-[5px] cursor-pointer overflow-y-auto">
                {sessions.map((session) => (
                  <Link key={session.id} href={`/yachiyo/${session.id}`}>
                    <li className="truncate p-[9px_6px_9px_10px] rounded-[12px] hover:bg-[#282840]">
                      {session.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
          {/* 侧边栏底部登录设置等按钮 */}
          <div className="h-[44px] relative">
            <SiderLogin />
          </div>
        </div>
      </div>
      {/* 绝对定位时遮罩层 */}
      {isExpanded && (
        <div
          onClick={() => setExpanded(false)}
          className="md:hidden fixed inset-0 z-10 bg-black/40"
        />
      )}
    </>
  );
};
