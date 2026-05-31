import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Document {
  id: string;
  knowledge_base_id: string;
  filename: string;
  file_type: string;
  file_size: number | null;
  total_chunks: number | null;
  created_at: string;
  updated_at: string;
}

// ==================== 查询 ====================

/** 单个知识库下的文档列表 */
export function useDocuments(knowledgeBaseId: string | null) {
  return useQuery({
    queryKey: ["documents", knowledgeBaseId],
    queryFn: async (): Promise<Document[]> => {
      if (!knowledgeBaseId) return [];
      const res = await fetch(
        `/api/initialData/getDocuments?knowledgeBaseId=${knowledgeBaseId}`,
      );
      const data = await res.json();
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
}

// ==================== 变更 ====================

/** 上传文档（完成后刷新文档列表） */
export function useUploadDocument(baseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      filename: string;
      file_type: string;
      file_size: number;
      raw_content: string;
    }) => {
      const res = await fetch(`/api/knowledge-bases/${baseId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "上传失败");
      return json;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", baseId] });
    },
  });
}

/** 重命名文档（乐观更新） */
export function useRenameDocument(baseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      filename,
    }: {
      documentId: string;
      filename: string;
    }) => {
      const res = await fetch(`/api/knowledge-bases/${baseId}/documents`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, filename }),
      });
      return res.json();
    },
    onMutate: async ({ documentId, filename }) => {
      await queryClient.cancelQueries({ queryKey: ["documents", baseId] });
      const previous = queryClient.getQueryData<Document[]>([
        "documents",
        baseId,
      ]);

      queryClient.setQueryData<Document[]>(["documents", baseId], (old) =>
        (old || []).map((doc) =>
          doc.id === documentId ? { ...doc, filename } : doc,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["documents", baseId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", baseId] });
    },
  });
}

/** 删除文档（乐观更新） */
export function useRemoveDocument(baseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const res = await fetch(
        `/api/knowledge-bases/${baseId}/documents?documentId=${documentId}`,
        { method: "DELETE" },
      );
      return res.json();
    },
    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: ["documents", baseId] });
      const previous = queryClient.getQueryData<Document[]>([
        "documents",
        baseId,
      ]);

      queryClient.setQueryData<Document[]>(["documents", baseId], (old) =>
        (old || []).filter((doc) => doc.id !== documentId),
      );
      return { previous };
    },
    onError: (_err, _documentId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["documents", baseId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", baseId] });
    },
  });
}
