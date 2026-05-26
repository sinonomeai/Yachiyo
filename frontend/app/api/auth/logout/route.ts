import { NextResponse } from "next/server";
import { cookies } from "next/headers";
//后端清除cookie
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ success: true, message: "已退出登录" });
}
