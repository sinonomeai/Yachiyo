import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value as string;
  let userId: string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ error: "token 无效或已过期" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "缺少 sessionId" }, { status: 400 });
  }

  try {
    const sessionResult = await pool.query(
      `SELECT id, title, created_at, updated_at
       FROM chat_sessions
       WHERE id = $1 AND user_id = $2`,
      [sessionId, userId],
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ error: "会话不存在" }, { status: 404 });
    }


    const messagesResult = await pool.query(
      `SELECT id, role, parts, created_at
       FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [sessionId],
    );

    return NextResponse.json({
      session: sessionResult.rows[0],
      messages: messagesResult.rows,
    });
  } catch (error) {
    console.error("获取会话数据失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
