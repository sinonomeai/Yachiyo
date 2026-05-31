import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface KnowledgeBase {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// ==================== 查询 ====================

/** 知识库列表 */
export function useKBases() {
  return useQuery({
    queryKey: ["kBases"],
    queryFn: async (): Promise<KnowledgeBase[]> => {
      const res = await fetch("/api/initialData/getKBases");
      const data = await res.json();
      if (!data.success) return [];
      return (data.kBases || []).map((kb: any) => ({
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
}

// ==================== 变更 ====================

/** 创建知识库（乐观更新） */
export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => {
      const res = await fetch("/api/knowledge-bases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "创建失败");
      return data.data;
    },
    onMutate: async ({ name, description }) => {
      await queryClient.cancelQueries({ queryKey: ["kBases"] });
      const previous = queryClient.getQueryData<KnowledgeBase[]>(["kBases"]);

      const optimistic: KnowledgeBase = {
        id: `temp-${Date.now()}`,
        user_id: "",
        name,
        description: description || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      queryClient.setQueryData<KnowledgeBase[]>(["kBases"], (old) => [
        optimistic,
        ...(old || []),
      ]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["kBases"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["kBases"] });
    },
  });
}

/** 修改知识库（乐观更新） */
export function useUpdateKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
    }: {
      id: string;
      name: string;
      description?: string;
    }) => {
      const res = await fetch("/api/knowledge-bases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, description }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "修改失败");
      return data.data;
    },
    onMutate: async ({ id, name, description }) => {
      await queryClient.cancelQueries({ queryKey: ["kBases"] });
      const previous = queryClient.getQueryData<KnowledgeBase[]>(["kBases"]);

      queryClient.setQueryData<KnowledgeBase[]>(["kBases"], (old) =>
        (old || []).map((kb) =>
          kb.id === id
            ? { ...kb, name, description: description ?? kb.description }
            : kb,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["kBases"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["kBases"] });
    },
  });
}

/** 删除知识库（乐观更新） */
export function useRemoveKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/knowledge-bases?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "删除失败");
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["kBases"] });
      const previous = queryClient.getQueryData<KnowledgeBase[]>(["kBases"]);

      queryClient.setQueryData<KnowledgeBase[]>(["kBases"], (old) =>
        (old || []).filter((kb) => kb.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["kBases"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["kBases"] });
    },
  });
}
