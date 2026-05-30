import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Session {
  id: string;
  title: string;
  createdAt: Date;
}

/** 获取会话列表 */
export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async (): Promise<Session[]> => {
      const res = await fetch("/api/initialData/getList");
      const data = await res.json();
      if (!data.success || !data.sessions) return [];
      return data.sessions.map((s: any) => ({
        id: s.id,
        title: s.title,
        createdAt: new Date(s.created_at),
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** 新增会话 */
export function useAddSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ session, firstMessage }: { session: Session; firstMessage: string }) => {
      await fetch("/api/chat/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          firstMessage,
          createdAt: session.createdAt.toISOString(),
        }),
      });
    },
    onMutate: async ({ session }) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previous = queryClient.getQueryData<Session[]>(["sessions"]);
      queryClient.setQueryData<Session[]>(["sessions"], (old) => [session, ...(old || [])]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["sessions"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** 删除会话 */
export function useRemoveSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/chat/sessions?sessionId=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "删除失败");
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previous = queryClient.getQueryData<Session[]>(["sessions"]);
      queryClient.setQueryData<Session[]>(["sessions"], (old) =>
        (old || []).filter((s) => s.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["sessions"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** 更新会话标题 */
export function useUpdateSessionTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const res = await fetch("/api/chat/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id, title }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "重命名失败");
    },
    //乐观更新
    onMutate: async ({ id, title }) => {
      //取消所有正在进行的 ["sessions"] 查询请求，防止它们返回后覆盖我们即将做的乐观更新。
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      //从缓存中取出当前的会话列表数据，保存到 previous 变量。这个数据用于请求失败时回滚。
      const previous = queryClient.getQueryData<Session[]>(["sessions"]);
      //手动更新缓存中 ["sessions"] 的数据。old 是当前的旧缓存数据。
      queryClient.setQueryData<Session[]>(["sessions"], (old) =>
        (old || []).map((s) => (s.id === id ? { ...s, title } : s)),
      );
      //返回包含旧数据的对象，这个对象会传给 onError 中的 context 参数，用于失败时回滚。
      return { previous };
    },
    //
    onError: (_err, _vars, context) => {
      //判断 context 中是否存在 previous（即旧数据）。?. 是可选链，避免 context 为 null 时报错。
      //用之前保存的旧数据 previous 恢复缓存，让 UI 回到修改前的状态（回滚）。
      if (context?.previous) {
        queryClient.setQueryData(["sessions"], context.previous);
      }
    },
    //无论 mutationFn 成功还是失败，最终都会执行的函数。
    onSettled: () => {
      //让 ["sessions"] 的缓存失效，触发重新从后端获取最新数据，确保 UI 与服务端最终一致。
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
