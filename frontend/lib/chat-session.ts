export const loadHistory = async ({ sessionId }: { sessionId: string }) => {
  //获取单对话页的标题以及历史消息
  try {
    const res = await fetch(`/api/chat/sessions?sessionId=${sessionId}`);
    const data = await res.json();
    return {
      success: true,
      session: data.session,
      messages: data.messages,
    };
  } catch (error) {
    console.error("加载历史消息失败:", error);
    return { success: false , session: null, messages: [] };
  }
};
