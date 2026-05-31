import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type { RefObject } from "react";
import { memo, useState } from "react";

interface ChatProps {
  messages: any[];
  status: string;
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}
//流式输出前占位
const ThinkingDots = () => (
  <div className="flex items-center gap-[4px]">
    <span className="text-[#8a8aa0] text-[16px]">思考中</span>
    <span className="inline-flex gap-[4px]">
      <span className="w-[5px] h-[5px] bg-[#8a8aa0] rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-[5px] h-[5px] bg-[#8a8aa0] rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-[5px] h-[5px] bg-[#8a8aa0] rounded-full animate-bounce [animation-delay:300ms]" />
    </span>
  </div>
);
//思考过程
const ReasoningBlock = memo(({ text, isStreaming }: { text: string; isStreaming: boolean }) => {
  const [collapsed, setCollapsed] = useState(!isStreaming);

  return (
    <div className="mb-3">
      <button
        type="button"
        className="flex items-center gap-[6px] text-[#8a8aa0] text-[13px] hover:text-[#b0b0c8] transition-colors cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}>
        <svg
          className={`w-[12px] h-[12px] transition-transform ${collapsed ? "" : "rotate-90"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span>{isStreaming ? "正在思考..." : "思考过程"}</span>
      </button>
      {!collapsed && (
        <div className="mt-[6px] pl-[18px] border-l-2 border-[#3a3a5c] text-[#6a6a88] text-[14px] leading-relaxed whitespace-pre-wrap break-words">
          {text}
          {isStreaming && (
            <span className="inline-block w-[2px] h-[16px] bg-[#6a6a88] ml-[2px] animate-pulse align-middle" />
          )}
        </div>
      )}
    </div>
  );
});

const MessageItem = memo(
  ({ message, status, isLast }: { message: any; status: string; isLast: boolean }) => {
    return (
      <div>
        {message.role === "user" ? (
          <div className="flex justify-end">
            <div className="max-w-[75%] bg-[#2a2a42] rounded-[16px] rounded-br-[4px] px-[18px] py-[12px]">
              {message.parts?.map((part: any, index: number) =>
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
            <div className="w-[40px] h-[40px] overflow-hidden rounded-full bg-[#3a3a5c] flex items-center justify-center mt-[4px]">
              <img
                src="/yachiyo.jpg"
                alt=""
                className="w-[40px] relative top-[22px] transform scale-150"
              />
            </div>
            <div className="w-[75%] min-h-[52px] flex flex-col gap-[16px]">
              <div className="h-full bg-[#1a1a2e] border border-[#282840] rounded-[16px] rounded-bl-[4px] px-[18px] py-[12px]">
                {message.parts?.map((part: any, index: number) => {
                  if (part.type === "reasoning") {
                    const reasoningText = part.reasoning || part.text || "";
                    return (
                      <ReasoningBlock
                        key={index}
                        text={reasoningText}
                        isStreaming={isLast && status === "streaming"}
                      />
                    );
                  }
                  if (part.type === "text") {
                    return (
                      <div key={index}>
                        {isLast && status === "streaming" && part.text ? (
                          <span className="text-[#e0e0ec] text-[16px] leading-relaxed whitespace-pre-wrap break-words">
                            {part.text}
                            <span className="relative top-[3px] inline-block w-[2px] h-[20px] bg-[#e0e0ec] ml-[2px] animate-pulse" />
                          </span>
                        ) : (
                          <div
                            className="markdown-body text-[#e0e0ec] text-[16px] leading-relaxed whitespace-pre-wrap break-words
                          [&_pre]:rounded-lg [&_pre]:bg-[#0d0d1a] [&_pre]:p-4 [&_pre]:overflow-x-auto
                          [&_code]:text-[13px] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
                          [&_p]:mb-2 [&_p:last-child]:mb-0
                          [&_ul]:mb-2 [&_ul]:pl-5 [&_ul]:mt-0 [&_ul]:list-disc
                          [&_ol]:mb-2 [&_ol]:pl-5 [&_ol]:mt-0 [&_ol]:list-decimal
                          [&_li]:mt-0 [&_li:first-child]:mt-0
                          [&_li>p:first-of-type]:mt-0
                          [&_li]:whitespace-normal
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
                              rehypePlugins={[rehypeHighlight]}>
                              {part.text}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

export const Chat = ({ messages, status, isLoading, messagesEndRef }: ChatProps) => {
  const historyMessages = messages.slice(0, -1);
  const lastMessage = messages[messages.length - 1];

  if (isLoading && !messages.length) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="flex items-center gap-[4px] text-[#8a8aa0] text-[16px]">
          <span>加载中</span>
          <span className="inline-flex gap-[4px]">
            <span className="w-[5px] h-[5px] bg-[#8a8aa0] rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-[5px] h-[5px] bg-[#8a8aa0] rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-[5px] h-[5px] bg-[#8a8aa0] rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
      <div className="max-w-[840px] mx-auto px-[32px] py-[24px] flex flex-col gap-[24px]">
        {historyMessages.map((message) => (
          <MessageItem key={message.id} message={message} status={status} isLast={false} />
        ))}

        {lastMessage && (
          <MessageItem key={lastMessage.id} message={lastMessage} status={status} isLast={true} />
        )}

        {/* 等待 assistant 消息出现时的思考占位 */}
        {(status === "submitted" || status === "streaming") && lastMessage?.role === "user" && (
          <div className="flex gap-[12px] justify-start">
            <div className="w-[40px] h-[40px] overflow-hidden rounded-full bg-[#3a3a5c] flex items-center justify-center mt-[4px]">
              <img
                src="/yachiyo.jpg"
                alt=""
                className="w-[40px] relative top-[22px] transform scale-150"
              />
            </div>
            <div className="bg-[#1a1a2e] border border-[#282840] rounded-[16px] rounded-bl-[4px] px-[18px] py-[12px]">
              <ThinkingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
