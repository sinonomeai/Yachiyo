"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#14141f] text-[#8a8aa0]">
      <div className="flex flex-col items-center gap-8">
        <h1 className="font-press-start text-[80px] text-[#ededed]">404</h1>
        <p className="text-[18px]">This page has wandered into the shadows</p>
        <Link
          href="/yachiyo"
          className="mt-4 px-8 py-3 rounded-lg border border-[#8a8aa0]/30
                     text-[16px] text-[#ededed] bg-[#ffffff]/5
                     hover:bg-[#ffffff]/10 hover:border-[#8a8aa0]/50
                     transition-colors duration-200"
        >
          Return to Yachiyo
        </Link>
      </div>
    </div>
  );
}
