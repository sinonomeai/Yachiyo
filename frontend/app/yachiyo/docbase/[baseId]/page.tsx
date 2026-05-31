"use client";
import { useParams } from "next/navigation";
import { useKBases } from "@/hooks/useKnowledgeBaseData";
import { useDocuments } from "@/hooks/useDocBasesData";
import { UploadSection } from "./components/UploadSection";
import { DocumentList } from "./components/DocumentList";



export default function DocBaseDetail() {
  const params = useParams();
  const baseId = params.baseId as string;

  const { data: kBases = [] } = useKBases();
  const kb = kBases.find((kb: any) => kb.id === baseId);
  const { data: documents = [], isLoading } = useDocuments(baseId);

  return (
    <>
      {/* 顶部信息区 */}
      <div className="px-[32px] pt-[24px] pb-[16px]">
        <div className="w-full">
          <div className="w-full h-[40px] flex gap-[10px]">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-[#282840] flex items-center justify-center">
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
            <div className="flex-1 text-[#e0e0ec] text-[22px] font-medium leading-[40px]">
              <span>{kb?.name ?? "知识库"}</span>
            </div>
          </div>

          {kb?.description && (
            <p className="indent-[50px] text-[#8a8aa0] text-[14px]">{kb.description}</p>
          )}
        </div>
      </div>

      {/* 文档区域 */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-[32px] pb-[24px]">
        <div className="max-w-[840px] mx-auto">
          <UploadSection baseId={baseId} />
          <DocumentList documents={documents} isLoading={isLoading} baseId={baseId} />
        </div>
      </div>
    </>
  );
}
