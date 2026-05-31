import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value as string;

  if (!token) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // 获取用户的所有会话（只获取列表，不包含消息）
    const sessionsResult = await pool.query(
      `SELECT id, title, created_at, updated_at
       FROM chat_sessions
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [decoded.userId],
    );

    return NextResponse.json({
      success: true,
      sessions: sessionsResult.rows,
    });
  } catch (error) {
    console.error("获取会话列表失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
