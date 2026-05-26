import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";


//获取指定知识库下的所有文档信息
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

  const knowledgeBaseId = req.nextUrl.searchParams.get("knowledgeBaseId");
  if (!knowledgeBaseId) {
    return NextResponse.json({ success: false, message: "缺少 knowledgeBaseId" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT id, knowledge_base_id, filename, file_type, file_size, total_chunks, created_at, updated_at
       FROM documents
       WHERE knowledge_base_id = $1
       ORDER BY created_at DESC`,
      [knowledgeBaseId],
    );

    return NextResponse.json({ success: true, documents: result.rows });
  } catch (error) {
    console.error("获取文档列表失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}
