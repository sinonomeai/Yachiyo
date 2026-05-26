import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
//获取文档的所有向量信息
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
      `SELECT id, document_id, chunk_index, content, metadata, created_at
       FROM document_chunks
       WHERE document_id = $1
       ORDER BY chunk_index ASC`,
      [documentId],
    );

    return NextResponse.json({ success: true, chunks: result.rows });
  } catch (error) {
    console.error("获取向量块失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}
