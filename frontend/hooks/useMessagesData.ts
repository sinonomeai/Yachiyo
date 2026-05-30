import { useQuery } from "@tanstack/react-query";

/** 根据会话 id 加载历史消息，标题为 "新对话" 时每 2s 轮询等待 AI 标题生成 */
export const useMessages = ({ sessionId }: { sessionId: string }) => {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/sessions?sessionId=${sessionId}`);
      const data = await res.json();
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
