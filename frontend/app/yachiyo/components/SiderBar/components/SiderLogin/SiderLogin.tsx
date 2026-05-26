import { useState, useEffect } from "react";
import { logout } from "@/lib/logout";
import { Popup } from "@/components/Popup/Popup";
export const SiderLogin = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user?.name);
    }
  }, []);
  return (
    <>
      <div
        onClick={toggleMenu}
        className="h-full p-[6px_2px_6px_6px] 
      flex items-center cursor-pointer
      text-[#8a8aa0] hover:bg-[#282840] rounded-[12px] transition-colors duration-200">
        <div className="flex w-full h-full items-center justify-between text-[18px]">
          <p className="ml-1 text-[#e0e0ec]">{userName}</p>
          <span
            className="mr-2 relative top-[-3px]
          ">
            ...
          </span>
        </div>
      </div>
      <div
        onClick={toggleMenu}
        className={`absolute left-0 bottom-full mb-[8px] w-full min-w-[160px]
        bg-[#282840] border border-[#323248] rounded-[12px] p-[6px]
    
        ${isExpanded ? "block" : "hidden"}`}>
        <ul className="text-sm">
          <li
            onClick={() => setSettingOpen(true)}
            className="p-[8px_12px] rounded-[8px] hover:bg-[#323248] cursor-pointer transition-colors duration-200">
            设置
          </li>
          <li
            onClick={logout}
            className="p-[8px_12px] rounded-[8px] hover:bg-[#323248] cursor-pointer transition-colors duration-200 text-[#e0556a]">
            退出登录
          </li>
        </ul>
      </div>
      <Popup open={settingOpen} onClose={() => setSettingOpen(false)}>
        <div className="bg-[#1a1a2e] rounded-[16px] p-6 w-[360px]">
          <span className="text-[#e0e0ec] text-lg mb-4">设置</span>
        </div>
      </Popup>
    </>
  );
};
