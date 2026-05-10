import { SiderBar } from "./components/SiderBar/SiderBar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen text-[#8a8aa0] relative">
      <div className="h-screen">
        <SiderBar />
      </div>
      <main className="flex-1 flex bg-[#14141f]">{children}</main>
    </div>
  );
}
