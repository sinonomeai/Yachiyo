export default function DocBaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col bg-[#14141f]">
      <div className="w-full h-[50px] mt-[12px]"></div>
      <div className="flex-1 min-h-0">
        <div className="w-full h-full flex flex-col items-center px-[32px]">
          <div
            className="flex flex-col  h-full w-full lg:max-w-[880px] lg:min-w-[700px] md:min-w-[474px] sm:max-w-[712px] sm:min-w-[492px] 
      bg-[#1a1a2e] rounded-[10px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
