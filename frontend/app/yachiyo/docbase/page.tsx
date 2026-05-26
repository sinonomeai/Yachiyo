"use client";
import Link from "next/link";
import { useDocBases } from "@/hooks/useDocBasesData";

export default function DocBaseHome() {
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN");
  }
  const { data: docBases = [], isLoading } = useDocBases();

  return (
    <>
      <div className="h-[90px] w-full px-[32px] pt-[24px] pb-[8px]">
        <div className="max-w-[960px] mx-auto">
          <h1 className="text-[#e0e0ec] text-[22px] font-medium mb-1">知识库</h1>
          <p className="text-[#8a8aa0] text-[14px]">管理你的知识库与文档</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-[32px] pb-[32px]">
        <div className="max-w-[960px] mx-auto pt-[20px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <span className="text-[#8a8aa0] text-[16px]">加载中...</span>
            </div>
          ) : docBases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#5a5a78]">
              <svg
                className="w-[48px] h-[48px] mb-4 opacity-30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <p className="text-[14px]">暂无知识库</p>
              <p className="text-[12px] mt-1">点击侧边栏的 + 创建第一个知识库</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {docBases.map((kb: any) => (
                <Link
                  key={kb.id}
                  href={`/yachiyo/docbase/${kb.id}`}
                  className="bg-[#14141f] border border-[#282840] rounded-[14px] p-[20px]
                  hover:border-[#3a3a5c] hover:bg-[#1e1e34] transition-all duration-200
                  flex flex-col gap-[10px] min-h-[140px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[40px] h-[40px] rounded-[10px] bg-[#282840] flex items-center justify-center shrink-0">
                      <svg
                        className="w-[22px] h-[22px] text-[#8a8aa0]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <h3 className="text-[#e0e0ec] text-[16px] font-medium truncate">{kb.name}</h3>
                  </div>
                  {kb.description ? (
                    <p className="text-[#8a8aa0] text-[13px] leading-relaxed line-clamp-2">
                      {kb.description}
                    </p>
                  ) : (
                    <p className="text-[#5a5a78] text-[13px] italic">暂无描述</p>
                  )}
                  <p className="text-[#5a5a78] text-[12px] mt-auto">
                    创建于 {formatDate(kb.created_at)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


