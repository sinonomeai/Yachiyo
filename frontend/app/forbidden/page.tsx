"use client";
import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#14141f] text-[#8a8aa0]">
      <div className="flex flex-col items-center gap-8">
        <h1 className="font-press-start text-[80px] text-[#ededed]">403</h1>
        <p className="text-[18px]">You do not have permission to access this realm</p>
        <div className="flex mt-4">
          <Link
            href="/login"
            className="px-8 py-3 rounded-lg border border-[#8a8aa0]/30
                       text-[16px] text-[#ededed] bg-[#ffffff]/5
                       hover:bg-[#ffffff]/10 hover:border-[#8a8aa0]/50
                       transition-colors duration-200"
          >
            Go to Login
          </Link>

        </div>
      </div>
    </div>
  );
}
