import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SessionMenu } from "./components/SessionMenu/SessionMenu";
import { KbMenu } from "./components/KbMenu/KbMenu";
import { CreateKnowledgeBase } from "./components/KbMenu/CreateKnowledgeBase";

interface Session {
  id: string;
  title: string;
  createdAt: Date;
}

interface KnowledgeBase {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

type ListProps =
  | { isChat: true; listData: Session[] }
  | { isChat: false; listData: KnowledgeBase[] };

export const List = (props: ListProps) => {
  const pathName = usePathname();
  const { isChat, listData } = props;
  //弹出新增知识库表单
  const [createOpen, setCreateOpen] = useState(false);

  if (isChat) {
    return (
      <ul className=" custom-scrollbar h-full pr-[5px] overflow-y-auto">
        {listData.map((item) => (
          <li
            key={item.id}
            className={`mt-1 rounded-[12px] hover:bg-[#282840]
            ${pathName === `/yachiyo/chat/${item.id}` ? "bg-[#282840] text-bold" : ""}`}>
            <div className="flex items-center select-none">
              <Link
                href={`/yachiyo/chat/${item.id}`}
                className="flex-1 min-w-0 truncate p-[9px_6px_9px_10px]">
                {item.title}
              </Link>
              <SessionMenu id={item.id} title={item.title} />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <ul className="custom-scrollbar h-full pr-[5px] overflow-y-auto">
        <li className="flex items-center justify-between p-[9px_6px_9px_10px] mb-[12px] rounded-[12px] bg-[#282840]">
          <span className="text-[#8a8aa0] text-[13px]">知识库</span>
          <span
            onClick={() => setCreateOpen(true)}
            className="w-[22px] h-[22px] flex items-center justify-center rounded-[4px] hover:bg-[#3a3a5c] text-[16px] leading-none cursor-pointer">
            +
          </span>
        </li>
        {listData.map((item) => (
          <li
            key={item.id}
            className={`mt-1 rounded-[12px] hover:bg-[#282840] select-none
            ${pathName === `/yachiyo/docbase/${item.id}` ? "bg-[#282840] text-bold" : ""}`}>
            <div className="flex items-center">
              <Link
                href={`/yachiyo/docbase/${item.id}`}
                className="flex-1 min-w-0 truncate p-[9px_6px_9px_10px]">
                {item.name}
              </Link>
              <KbMenu id={item.id} name={item.name} description={item.description} />
            </div>
          </li>
        ))}
      </ul>
      <CreateKnowledgeBase open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
};
