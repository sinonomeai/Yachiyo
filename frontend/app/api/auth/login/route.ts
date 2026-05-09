import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log("登录请求数据:", { email, password });
    const response = await fetch(`http://localhost:3001/users?email=${email}`);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "无法连接到用户数据库" },
        { status: 500 },
      );
    }

    const users = await response.json();
    const user = users[0];

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: "账号或密码错误" },
        { status: 401 },
      );
    }

    //生成 JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    // 设置 HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true, // 前端 JS 无法读取，防 XSS
      secure: process.env.NODE_ENV === "production", //生产环境下才启用 secure
      sameSite: "lax", // 防 CSRF
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: "/",
    });
    return NextResponse.json({
      success: true,
      message: "登录成功",
      user: { id: user.id, name: user.username, email: user.email },
    });
  } catch (error) {
    console.error("登录错误:", error);
    return NextResponse.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 },
    );
  }
}
