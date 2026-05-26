import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Session {
  id: string;
  title: string;
  createdAt: Date;
}

async function fetchSessions(): Promise<Session[]> {
  const res = await fetch("/api/initialData/getList");
  const data = await res.json();
  if (!data.success || !data.sessions) return [];
  return data.sessions.map((s: any) => ({
    id: s.id,
    title: s.title,
    createdAt: new Date(s.created_at),
  }));
}

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    staleTime: 5 * 60 * 1000,
  });
}
//新增会话
export function useAddSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      session,
      firstMessage,
    }: {
      session: Session;
      firstMessage: string;
    }) => {
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
      queryClient.setQueryData<Session[]>(["sessions"], (old) => [
        session,
        ...(old || []),
      ]);
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
//删除
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
//更新标题
export function useUpdateSessionTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const res = await fetch("/api/chat/sessions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id, title }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "重命名失败");
    },
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previous = queryClient.getQueryData<Session[]>(["sessions"]);
      queryClient.setQueryData<Session[]>(["sessions"], (old) =>
        (old || []).map((s) => (s.id === id ? { ...s, title } : s)),
      );
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
