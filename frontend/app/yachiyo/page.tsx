"use client";
import { useState } from "react";
import { Input } from "./components/Input/Input";
import { useRouter } from "next/navigation";
import { useAddSession } from "@/hooks/useSessionsData";
export default function Dashboard() {
  const router = useRouter();
  const { mutate: addSession } = useAddSession();
  const [input, setInput] = useState("");
  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "") return;
    const messageSend = input;
    setInput("");

    //  前端生成 sessionId，立即跳转
    const sessionId = crypto.randomUUID();
    const createdAt = new Date();
    const encodedMessage = encodeURIComponent(messageSend);
    addSession({
      session: {
        id: sessionId,
        title: "新对话",
        createdAt: createdAt,
      },
      firstMessage: messageSend,
    });
    // 立即跳转，不等待后端
    router.push(`/yachiyo/chat/${sessionId}?initialMessage=${encodedMessage}`);
  };
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-[50px] mt-[12px] pl-[18px]"></div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="lg:w-full lg:max-w-[840px] lg:min-w-[762px] sm:max-w-[712px] sm:min-w-[492px] h-full min-h-[320px] p-[0_32px_64px]
          flex flex-col justify-center items-center gap-[20px]">
          <h1 className="font-press-start text-[40px]">YACHIYO</h1>
          <p className="text-[25px] px-[5px] break-all">Yaoyo~神明大人今天想聊点什么呢？</p>
          <Input onSubmit={onSubmit} input={input} setInput={setInput} />
        </div>
      </div>
    </div>
  );
}
