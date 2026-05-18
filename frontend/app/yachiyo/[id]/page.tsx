"use client";
import { useParams, useSearchParams } from "next/navigation";
import { Input } from "../components/Input/Input";
import { useSiderStore } from "@/state/stores/useSiderStore";
import { useListStore } from "@/state/stores/useListStore";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMessages } from "@/hooks/useMessagesData";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
export default function QA() {
  const router = useRouter();
  const { isExpanded } = useSiderStore();
  const { updateSessionTitle } = useListStore();
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.id;
  const [input, setInput] = useState("");
  const hasSentInitial = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat/stream",
      body: { sessionId },
    }),
  });

  //  加载历史消息与标题
  const { data: sessionData } = useMessages({ sessionId: sessionId as string });
  const title = sessionData?.title || "新对话";

  useEffect(() => {
    if (sessionData?.messages?.length) {
      setMessages(sessionData.messages);
    }
  }, [sessionData?.messages]);

  useEffect(() => {
    if (sessionData?.title && sessionData.title !== "新对话") {
      updateSessionTitle(sessionId as string, sessionData.title);
    }
  }, [sessionData?.title]);

  // 发送初始消息（只发送一次）
  useEffect(() => {
    const initialMessage = searchParams.get("initialMessage");
    if (initialMessage && initialMessage.trim() !== "" && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage({ text: decodeURIComponent(initialMessage) });
      router.replace(`/yachiyo/${sessionId}`);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //提交函数
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div
        className={`self-end ${isExpanded ? "md:w-full w-[calc(100%-76px)]" : "md:w-[calc(100%-246px)] w-[calc(100%-76px)]"} 
        transition-all duration-400 ease-in-out 
        h-[40px] mt-[12px] px-[30px] 
        flex items-center gap-[12px]`}>
        <p>{title}</p>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="max-w-[840px] mx-auto px-[32px] py-[24px] flex flex-col gap-[24px]">
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "user" ? (
                <div className="flex justify-end">
                  {/* 用户消息 */}
                  <div className="max-w-[75%] bg-[#2a2a42] rounded-[16px] rounded-br-[4px] px-[18px] py-[12px]">
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <span
                          key={index}
                          className="text-[#e0e0ec] text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                          {part.text}
                        </span>
                      ) : null,
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-[12px] justify-start">
                  {/* AI头像 */}
                  <div
                    className="w-[40px] h-[40px]
                    overflow-hidden
                    rounded-full bg-[#3a3a5c] 
                    flex items-center justify-center mt-[4px]">
                    <img
                      src="/yachiyo.jpg"
                      alt=""
                      className="
                      w-[40px] relative top-[22px]
                      transform scale-150"
                    />
                  </div>
                  {/* AI气泡 */}
                  <div className="w-[75%] min-h-[52px] flex flex-col gap-[16px]">
                    <div className="h-full bg-[#1a1a2e] border border-[#282840] rounded-[16px] rounded-bl-[4px] px-[18px] py-[12px]">
                      {message.parts.map((part, index) =>
                        part.type === "text" ? (
                          <div key={index}>
                            {status === "streaming" &&
                            message.id === messages[messages.length - 1]?.id ? (
                              <span className="text-[#e0e0ec] text-[16px] leading-relaxed whitespace-pre-wrap break-words">
                                {part.text}
                                <span className="inline-block w-[2px] h-[1em] bg-[#e0e0ec] ml-[2px] align-[-2px] animate-pulse" />
                              </span>
                            ) : (
                              <div
                                className="markdown-body text-[#e0e0ec] text-[16px] leading-relaxed whitespace-pre-wrap break-words
                                [&_pre]:rounded-lg [&_pre]:bg-[#0d0d1a] [&_pre]:p-4 [&_pre]:overflow-x-auto
                                [&_code]:text-[13px] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
                                [&_p]:mb-2 [&_p:last-child]:mb-0
                                [&_ul]:mb-2 [&_ul]:pl-5 [&_ul]:mt-0.5
                                [&_ol]:mb-2 [&_ol]:pl-5 [&_ol]:mt-0.5
                                [&_li]:mt-0.5 [&_li:first-child]:mt-0
                                [&_li>p]:mb-1
                                [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-2
                                [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-2.5
                                [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-2
                                [&_a]:text-blue-400 [&_a]:underline
                                [&_blockquote]:border-l-4 [&_blockquote]:border-[#3a3a5c] [&_blockquote]:pl-4 [&_blockquote]:my-2 [&_blockquote]:italic
                                [&_table]:w-full [&_table]:border-collapse [&_table]:mb-2
                                [&_th]:border [&_th]:border-[#3a3a5c] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-[#0d0d1a]
                                [&_td]:border [&_td]:border-[#3a3a5c] [&_td]:px-3 [&_td]:py-2
                                [&_del]:line-through [&_del]:opacity-60
                                [&_hr]:border-[#3a3a5c] [&_hr]:my-4
                                [&_input]:mr-2">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeHighlight]}
                                  >
                                  {part.text}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                        ) : null,
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ))}
          {/* 思考中占位 */}
          {status === "submitted" && (
            <div className="flex gap-[12px] justify-start">
              <div
                className="w-[40px] h-[40px]
                overflow-hidden
                rounded-full bg-[#3a3a5c]
                flex items-center justify-center mt-[4px]">
                <img
                  src="/yachiyo.jpg"
                  alt=""
                  className="
                  w-[40px] relative top-[22px]
                  transform scale-150"
                />
              </div>
              <div className="bg-[#1a1a2e] border border-[#282840] rounded-[16px] rounded-bl-[4px] px-[18px] py-[12px] flex items-center gap-[4px]">
                <span className="text-[#8a8aa0] text-[16px]">思考中</span>
                <span className="inline-flex gap-[4px]">
                  <span className="w-[5px] h-[5px] bg-[#8a8aa0] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-[5px] h-[5px] bg-[#8a8aa0] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-[5px] h-[5px] bg-[#8a8aa0] rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部输入区 */}
      <div className="px-[32px] pb-[24px]">
        <div className="lg:w-full lg:max-w-[840px] lg:min-w-[762px] sm:max-w-[712px] sm:min-w-[492px] mx-auto">
          <Input onSubmit={onSubmit} status={status} input={input} setInput={setInput} />
        </div>
      </div>
    </div>
  );
}
