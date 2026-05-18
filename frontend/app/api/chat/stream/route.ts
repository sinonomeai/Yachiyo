import { convertToModelMessages, streamText, UIMessage } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { saveUserMessage, saveAssistantMessage } from "@/lib/chat-store";
export const maxDuration = 30;

const deepseek = createDeepSeek({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  const { messages, sessionId }: { messages: UIMessage[]; sessionId: string } = await req.json();

  // 1. 获取用户消息内容
  const userMessage = messages[messages.length - 1];
  const userMessageContent = userMessage.parts;

  // 2. 保存用户消息
  await saveUserMessage({ sessionId, parts: userMessageContent });

  const modelMessages = await convertToModelMessages(messages);
  const result = streamText({
    model: deepseek("deepseek-v4-flash"),
    system: "You are a helpful assistant.",
    messages: modelMessages,
  });

  // 7. 返回流式响应并保存 AI 回复
  return result.toUIMessageStreamResponse({
    onFinish: async ({ messages: completedMessages }) => {
      const assistantMessage = completedMessages[completedMessages.length - 1];
      const assistantMessageContent = assistantMessage.parts;
      await saveAssistantMessage({ sessionId, parts: assistantMessageContent });
    },
  });
}
