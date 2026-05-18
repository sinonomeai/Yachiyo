"use client";
import { useState } from "react";
import { Input } from "./components/Input/Input";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { useListStore } from "@/state/stores/useListStore";
export default function Dashboard() {
  const router = useRouter();
  const {addSession} = useListStore()
  const [input, setInput] = useState("");
  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const messageSend = input;
    setInput("");

    //  前端生成 sessionId，立即跳转
    const sessionId = crypto.randomUUID();
    const createdAt = new Date()
    const encodedMessage = encodeURIComponent(messageSend);
    addSession({
      id: sessionId,
      title: "新对话",
      createdAt: createdAt,
    });
    // 立即跳转，不等待后端
    router.push(`/yachiyo/${sessionId}?initialMessage=${encodedMessage}`);

    // 后台异步创建会话（不阻塞跳转）
    try {
      await fetch("/api/chat/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          firstMessage: messageSend,
          createdAt: createdAt.toISOString(),
        }),
      });
    } catch (error) {
      console.error("后台创建会话失败:", error);
      message.error("会话创建失败，请重试");
    }
  };
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-[50px] mt-[12px] pl-[18px]"></div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="lg:w-full lg:max-w-[840px] lg:min-w-[762px] sm:max-w-[712px] sm:min-w-[492px] h-full min-h-[320px] p-[0_32px_64px]
          flex flex-col justify-center items-center gap-[10px]">
          <h1 className="font-press-start text-[35px]">YACHIYO</h1>
          <p className="text-[25px] px-[5px] break-all">
            Start a conversation and enter Tsukuyomi with Yachiyo
          </p>
          <Input onSubmit={onSubmit} input={input} setInput={setInput} />
        </div>
      </div>
    </div>
  );
}
