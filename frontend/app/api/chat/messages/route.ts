import { NextResponse } from "next/server";

export const loadHistory = async ({sessionId}:{sessionId:string}) => {
  try {
    const res = await fetch(`/api/chat/sessions?sessionId=${sessionId}`);
    const data = await res.json();
    return NextResponse.json({
      success: true,
      session: data.session,
      messages: data.messages,
    });
        
  } catch (error) {
    console.error("加载历史消息失败:", error);
    return NextResponse.json({ success: false, session: null, messages: [] }, { status: 500 });
  }
};
