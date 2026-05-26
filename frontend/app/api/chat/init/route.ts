import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { updateTitleAsync } from "./updateTitle/updateTitleAsync";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value as string;
  let userId: string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    userId = decoded.userId;
  } catch (error) {
    return NextResponse.json({ error: "token 无效或已过期" }, { status: 401 });
  }

  const { firstMessage, sessionId, createdAt } = await req.json();

  try {
    await pool.query(
      `INSERT INTO chat_sessions (id, user_id, title, created_at) VALUES ($1, $2, $3, $4)`,
      [sessionId, userId, "新对话", new Date(createdAt)],
    );

    updateTitleAsync(sessionId, firstMessage);

    return NextResponse.json({
      success: true,
    });
  } catch (dbError) {
    console.error("数据库写入失败:", dbError);
    return NextResponse.json({ error: "服务器内部错误，请稍后重试" }, { status: 500 });
  }
}
