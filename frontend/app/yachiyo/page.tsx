"use client";
import { Input } from "./components/Input/Input";
export default function Dashboard() {
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
          <Input />
        </div>
      </div>
    </div>
  );
}
