import { useQuery } from "@tanstack/react-query";
import { loadHistory } from "@/lib/chat-session";
//根据会话id缓存对应会话消息
export const useMessages = ({ sessionId }: { sessionId: string }) => {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const data = await loadHistory({ sessionId });
      if (!data.success) return { title: null, messages: [] };
      return {
        title: data.session?.title ?? null,
        messages: (data.messages || []).map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          parts: msg.parts,
        })),
      };
    },
    enabled: !!sessionId,
    staleTime: 0,
    refetchInterval: (query) => {
      const title = query.state.data?.title;
      if (title && title !== "新对话") return false;
      return 2000;
    },
  });
};
