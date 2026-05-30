import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
//获取所有知识库信息
export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "未登录" }, { status: 401 });
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ success: false, message: "token 无效" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `SELECT id, user_id, name, description, created_at, updated_at
       FROM knowledge_bases
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId],
    );

    return NextResponse.json({ success: true, kBases: result.rows });
  } catch (error) {
    console.error("获取知识库列表失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}
