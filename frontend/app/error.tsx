"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught error:", error);
  }, [error]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#14141f] text-[#8a8aa0]">
      <div className="flex flex-col items-center gap-8">
        <h1 className="font-press-start text-[80px] text-[#ededed]">500</h1>
        <p className="text-[18px]">Something went wrong in Yachiyo</p>
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={reset}
            className="px-8 py-3 rounded-lg border border-[#8a8aa0]/30
                       text-[16px] text-[#ededed] bg-[#ffffff]/5
                       hover:bg-[#ffffff]/10 hover:border-[#8a8aa0]/50
                       transition-colors duration-200 cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/yachiyo"
            className="px-8 py-3 rounded-lg border border-[#8a8aa0]/30
                       text-[16px] text-[#ededed] bg-[#ffffff]/5
                       hover:bg-[#ffffff]/10 hover:border-[#8a8aa0]/50
                       transition-colors duration-200"
          >
            Return to Yachiyo
          </Link>
        </div>
      </div>
    </div>
  );
}
