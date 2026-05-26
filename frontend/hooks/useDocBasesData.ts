import { useQuery } from "@tanstack/react-query";
import { fetchDocBases, fetchDocuments, fetchChunks } from "@/lib/docbase";

/** 知识库列表（含文档） */
export const useDocBases = () => {
  return useQuery({
    queryKey: ["docBases"],
    queryFn: async () => {
      const data = await fetchDocBases();
      if (!data.success) return [];
      return (data.docBases || []).map((kb: any) => ({
        id: kb.id,
        user_id: kb.user_id,
        name: kb.name,
        description: kb.description,
        created_at: kb.created_at,
        updated_at: kb.updated_at,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

/** 单个知识库下的文档列表 */
export const useDocuments = (knowledgeBaseId: string | null) => {
  return useQuery({
    queryKey: ["documents", knowledgeBaseId],
    queryFn: async () => {
      if (!knowledgeBaseId) return [];
      const data = await fetchDocuments(knowledgeBaseId);
      if (!data.success) return [];
      return (data.documents || []).map((doc: any) => ({
        id: doc.id,
        knowledge_base_id: doc.knowledge_base_id,
        filename: doc.filename,
        file_type: doc.file_type,
        file_size: doc.file_size,
        total_chunks: doc.total_chunks,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
      }));
    },
    enabled: !!knowledgeBaseId,
    staleTime: 5 * 60 * 1000,
  });
};

/** 单个文档的向量块数据 */
export const useChunks = (documentId: string | null) => {
  return useQuery({
    queryKey: ["chunks", documentId],
    queryFn: async () => {
      if (!documentId) return [];
      const data = await fetchChunks(documentId);
      if (!data.success) return [];
      return (data.chunks || []).map((chunk: any) => ({
        id: chunk.id,
        document_id: chunk.document_id,
        chunk_index: chunk.chunk_index,
        content: chunk.content,
        metadata: chunk.metadata,
        created_at: chunk.created_at,
      }));
    },
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
  });
};
