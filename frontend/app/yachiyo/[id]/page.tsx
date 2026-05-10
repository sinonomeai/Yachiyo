"use client";
import { useParams } from "next/navigation";
import { Input } from "../components/Input/Input";
import { useSiderStore } from "@/state/stores/useSiderStore";
import {useChat} from "@ai-sdk/react"
import { DefaultChatTransport } from "ai";
export default function QA() {
  const {isExpanded,setExpanded} = useSiderStore()
  const params = useParams();
  const historyId = params.id;
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });


  return (
    <div className="w-full h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div
        className={`self-end ${isExpanded ? "md:w-full w-[calc(100%-76px)]" : "md:w-[calc(100%-246px)] w-[calc(100%-76px)]"} 
        transition-all duration-400 ease-in-out 
        h-[40px] mt-[12px] px-[30px] 
        flex items-center gap-[12px]`}>
        <p>测试标题</p>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="max-w-[840px] mx-auto px-[32px] py-[24px] flex flex-col gap-[24px]">
          {/* 用户消息 */}
          <div className="flex justify-end">
            <div className="max-w-[75%] bg-[#2a2a42] rounded-[16px] rounded-br-[4px] px-[18px] py-[12px]">
              <p className="text-[#e0e0ec] text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                你好，请帮我介绍一下 TypeScript 的核心特性
              </p>
            </div>
          </div>

          {/* AI 消息 */}
          <div className="flex gap-[12px]">
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
            <div className="max-w-[75%] flex flex-col gap-[16px]">
              <div className="bg-[#1a1a2e] border border-[#282840] rounded-[16px] rounded-bl-[4px] px-[18px] py-[12px]">
                <p className="text-[#e0e0ec] text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                  TypeScript 是 JavaScript 的超集，主要特性包括：
                  <br />
                  <br />
                  1. <strong>静态类型检查</strong>
                  ：在编译时捕获类型错误，减少运行时异常
                  <br />
                  2. <strong>类型推断</strong>：自动推断变量类型，减少显式注解
                  <br />
                  3. <strong>接口与泛型</strong>：提供强大的抽象和复用能力
                  <br />
                  4. <strong>现代 ES 特性</strong>：支持装饰器、可选链等新语法
                </p>
              </div>
            </div>
          </div>
          {/* 用户消息 */}
          <div className="flex justify-end">
            <div className="max-w-[75%] bg-[#2a2a42] rounded-[16px] rounded-br-[4px] px-[18px] py-[12px]">
              <p className="text-[#e0e0ec] text-[14px] leading-rpxelaxed whitespace-pre-wrap break-words">
                你好，请帮我介绍一下 TypeScript 的核心特性
              </p>
            </div>
          </div>

          {/* AI 消息 */}
          <div className="flex gap-[12px]">
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
            <div className="max-w-[75%] flex flex-col gap-[16px]">
              <div className="bg-[#1a1a2e] border border-[#282840] rounded-[16px] rounded-bl-[4px] px-[18px] py-[12px]">
                <p className="text-[#e0e0ec] text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                  TypeScript 是 JavaScript 的超集，主要特性包括：
                  <br />
                  <br />
                  1. <strong>静态类型检查</strong>
                  ：在编译时捕获类型错误，减少运行时异常
                  <br />
                  2. <strong>类型推断</strong>：自动推断变量类型，减少显式注解
                  <br />
                  3. <strong>接口与泛型</strong>：提供强大的抽象和复用能力
                  <br />
                  4. <strong>现代 ES 特性</strong>：支持装饰器、可选链等新语法
                </p>
              </div>
            </div>
          </div>
          {/* 用户消息 */}
          <div className="flex justify-end">
            <div className="max-w-[75%] bg-[#2a2a42] rounded-[16px] rounded-br-[4px] px-[18px] py-[12px]">
              <p className="text-[#e0e0ec] text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                你好，请帮我介绍一下 TypeScript 的核心特性
              </p>
            </div>
          </div>

          {/* AI 消息 */}
          <div className="flex gap-[12px]">
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
            <div className="max-w-[75%] flex flex-col gap-[16px]">
              <div className="bg-[#1a1a2e] border border-[#282840] rounded-[16px] rounded-bl-[4px] px-[18px] py-[12px]">
                <p className="text-[#e0e0ec] text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                  TypeScript 是 JavaScript 的超集，主要特性包括：
                  <br />
                  <br />
                  1. <strong>静态类型检查</strong>
                  ：在编译时捕获类型错误，减少运行时异常
                  <br />
                  2. <strong>类型推断</strong>：自动推断变量类型，减少显式注解
                  <br />
                  3. <strong>接口与泛型</strong>：提供强大的抽象和复用能力
                  <br />
                  4. <strong>现代 ES 特性</strong>：支持装饰器、可选链等新语法
                </p>
              </div>
            </div>
          </div>

          {/* 用户消息 */}
          <div className="flex justify-end">
            <div className="max-w-[75%] bg-[#2a2a42] rounded-[16px] rounded-br-[4px] px-[18px] py-[12px]">
              <p className="text-[#e0e0ec] text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                能给我一个简单的泛型示例吗？
              </p>
            </div>
          </div>

          {/* AI 消息 */}
          <div className="flex gap-[12px]">
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
            <div className="max-w-[75%]">
              <div className="bg-[#1a1a2e] border border-[#282840] rounded-[16px] rounded-bl-[4px] px-[18px] py-[12px]">
                <p className="text-[#e0e0ec] text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                  当然，这是一个简单的泛型函数：
                </p>
                <div className="mt-[8px] bg-[#14141f] rounded-[8px] p-[12px] overflow-x-auto">
                  <code className="text-[#c4a7e7] text-[13px] leading-relaxed">
                    {`function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = firstElement([1, 2, 3]);     // number
const str = firstElement(["a", "b"]);    // string`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部输入区 */}
      <div className="px-[32px] pb-[24px]">
        <div className="max-w-[840px] mx-auto">
          <Input />
        </div>
      </div>
    </div>
  );
}
