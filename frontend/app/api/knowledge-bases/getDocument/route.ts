import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
//获取文档内容
export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "未登录" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ success: false, message: "token 无效" }, { status: 401 });
  }

  const documentId = req.nextUrl.searchParams.get("documentId");
  if (!documentId) {
    return NextResponse.json({ success: false, message: "缺少 documentId" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT id, filename, raw_content, created_at
       FROM documents
       WHERE id = $1`,
      [documentId],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "文档不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, document: result.rows[0] });
  } catch (error) {
    console.error("获取文档内容失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}
