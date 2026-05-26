import { convertToModelMessages, streamText, UIMessage } from "ai";
import { createDeepSeek, type DeepSeekLanguageModelOptions } from "@ai-sdk/deepseek";
import { saveUserMessage, saveAssistantMessage } from "@/lib/chat-store";
import { buildRagContext, rewriteQuery } from "./rag/buildRagContext";
export const maxDuration = 30;

const deepseek = createDeepSeek({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const BASE_SYSTEM_PROMPT = "You are a helpful assistant.";

export async function POST(req: Request) {
  const {
    messages,
    sessionId,
    deepThinking,
    knowledgeBaseId,
    documentIds,
  }: {
    messages: UIMessage[];
    sessionId: string;
    deepThinking: boolean;
    knowledgeBaseId?: string;
    documentIds?: string[];
  } = await req.json();

  // 1. 获取用户消息内容
  const userMessage = messages[messages.length - 1];
  const userMessageContent = userMessage.parts;

  // 2. 保存用户消息
  await saveUserMessage({ sessionId, parts: userMessageContent });

  // 3. 提取用户问题文本
  const userQuestion = userMessageContent
    .filter((p: any) => p.type === "text")
    .map((p: any) => p.text)
    .join("\n");

  // 4. 构建 system prompt（含 RAG 上下文）
  let systemPrompt = BASE_SYSTEM_PROMPT;

  if (knowledgeBaseId && documentIds && documentIds.length > 0) {
    try {
      //  改写用户问题
      const rewrittenQuery = await rewriteQuery(userQuestion);
      console.log("原始问题:", userQuestion);
      console.log("改写后:", rewrittenQuery);

      // 用改写后的问题进行 RAG 检索
      const ragContext = await buildRagContext(rewrittenQuery, documentIds);
      if (ragContext) {
        systemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${ragContext}`;
      }
    } catch (error) {
      console.error("RAG 检索失败，回退到普通对话:", error);
    }
  }

  // 5. 流式生成
  const modelMessages = await convertToModelMessages(messages);
  const result = streamText({
    model: deepseek("deepseek-v4-flash"),
    system: systemPrompt,
    messages: modelMessages,
    providerOptions: {
      deepseek: {
        thinking: { type: deepThinking ? "enabled" : "disabled" },
        reasoningEffort: "high",
      } satisfies DeepSeekLanguageModelOptions,
    },
  });

  // 6. 返回流式响应并保存 AI 回复
  return result.toUIMessageStreamResponse({
    onFinish: async ({ messages: completedMessages }) => {
      const assistantMessage = completedMessages[completedMessages.length - 1];
      const assistantMessageContent = assistantMessage.parts;
      await saveAssistantMessage({ sessionId, parts: assistantMessageContent });
    },
  });
}

