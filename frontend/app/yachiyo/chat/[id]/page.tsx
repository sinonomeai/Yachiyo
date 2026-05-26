"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Input } from "../../components/Input/Input";
import { useSiderStore } from "@/state/stores/useSiderStore";
import { useSessions, useUpdateSessionTitle } from "@/hooks/useSessionsData";
import { useKnowledgeStore } from "@/state/stores/useKnowledgeStore";
import { useDeepThinkingStore } from "@/state/stores/useDeepThinkingStore";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMessages } from "@/hooks/useMessagesData";
import { Chat } from "./components/chat";
export default function QA() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.id as string;
  const [input, setInput] = useState("");
  //保存是否发送初始消息状态，避免重复发送
  const hasSentInitial = useRef(false);
  //绑定最底部
  const messagesEndRef = useRef<HTMLDivElement>(null);
  //控制展开
  const { isExpanded } = useSiderStore();
  //知识库选中
  const { selectedBaseId, selectedDocumentIds } = useKnowledgeStore();
  //深度思考模式选中
  const { deepThinking, setThinkingMod } = useDeepThinkingStore();
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat/stream",
      body: { sessionId },
    }),
  });
  //获取历史消息
  const { data: sessionData, isLoading: isHistoryLoading } = useMessages({ sessionId });
  //标题更新
  const { data: sessions = [] } = useSessions();
  const { mutate: updateSessionTitle } = useUpdateSessionTitle();
  const localSession = sessions.find((s: any) => s.id === sessionId);
  const title = sessionData?.title || localSession?.title || "新对话";

  //添加历史消息于上下文
  useEffect(() => {
    if (sessionData?.messages?.length && status === "ready") {
      setMessages(sessionData.messages);
    }
  }, [sessionData?.messages]);
  //等待后台轮询获取title（仅在标题真正变化时同步）
  useEffect(() => {
    if (
      sessionData?.title &&
      sessionData.title !== "新对话" &&
      sessionData.title !== localSession?.title
    ) {
      updateSessionTitle({ id: sessionId, title: sessionData.title });
    }
  }, [sessionData?.title]);
  //获取新对话初始消息并发送重定向
  useEffect(() => {
    const initialMessage = searchParams.get("initialMessage");
    if (initialMessage && initialMessage.trim() !== "" && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage(
        { text: decodeURIComponent(initialMessage) },
        {
          body: {
            deepThinking,
            knowledgeBaseId: selectedBaseId,
            documentIds: selectedDocumentIds,
          },
        },
      );
      router.replace(`/yachiyo/chat/${sessionId}`);
    }
  }, [sessionId, selectedBaseId, selectedDocumentIds]);
  //控制输出或加载跳转到底部
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  useLayoutEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: status === "streaming" ? "smooth" : "auto",
      });
    }, 50);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [messages, status]);
  //提交函数
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            deepThinking,
            knowledgeBaseId: selectedBaseId,
            documentIds: selectedDocumentIds,
          },
        },
      );
      setInput("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className={`self-end ${isExpanded ? "md:w-full w-[calc(100%-76px)]" : "md:w-[calc(100%-246px)] w-[calc(100%-76px)]"}
        transition-all duration-400 ease-in-out
        h-[40px] mt-[12px] px-[30px]
        flex items-center gap-[12px]`}>
        <p>{title}</p>
      </div>

      <Chat messages={messages} status={status} isLoading={isHistoryLoading} messagesEndRef={messagesEndRef} />

      <div className="px-[32px] pb-[24px]">
        <div className="lg:w-full lg:max-w-[840px] lg:min-w-[762px] sm:max-w-[712px] sm:min-w-[492px] mx-auto">
          <Input onSubmit={onSubmit} status={status} input={input} setInput={setInput} />
        </div>
      </div>
    </div>
  );
}
