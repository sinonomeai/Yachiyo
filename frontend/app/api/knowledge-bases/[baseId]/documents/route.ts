import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { chunkMarkdown } from "@/lib/chunk";
import { embedChunks } from "@/lib/embed";
//将数组向量转换为字符串格式
function formatVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

//上传文档
export async function POST(req: NextRequest, { params }: { params: Promise<{ baseId: string }> }) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "未登录" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ success: false, message: "token 无效或已过期" }, { status: 401 });
  }

  const { baseId } = await params;

  const { filename, file_type, file_size, raw_content } = await req.json();

  if (!filename || !raw_content) {
    return NextResponse.json({ success: false, message: "缺少必填字段" }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. 插入文档记录
    const docResult = await client.query(
      `INSERT INTO documents (knowledge_base_id, filename, file_type, file_size, raw_content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, knowledge_base_id, filename, file_type, file_size, total_chunks, created_at, updated_at`,
      [baseId, filename, file_type || "md", file_size || null, raw_content],
    );

    const documentId = docResult.rows[0].id;

    // 2. 切片并向量化
    const chunks = chunkMarkdown(raw_content);
    if (chunks.length > 0) {
      const embeddings = await embedChunks(chunks);

      for (let i = 0; i < chunks.length; i++) {
        await client.query(
          `INSERT INTO document_chunks (document_id, chunk_index, content, embedding, metadata)
           VALUES ($1, $2, $3, $4::vector, $5)`,
          [documentId, i, chunks[i], formatVector(embeddings[i]), JSON.stringify({})],
        );
      }
    }

    // 3. 更新文档的 total_chunks
    await client.query(
      `UPDATE documents SET total_chunks = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [chunks.length, documentId],
    );

    docResult.rows[0].total_chunks = chunks.length;

    await client.query("COMMIT");

    return NextResponse.json({ success: true, data: docResult.rows[0] }, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("上传文档失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  } finally {
    client.release();
  }
}
//删除文档
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "未登录" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ success: false, message: "token 无效或已过期" }, { status: 401 });
  }

  const documentId = req.nextUrl.searchParams.get("documentId");
  if (!documentId) {
    return NextResponse.json({ success: false, message: "缺少 documentId" }, { status: 400 });
  }

  try {
    await pool.query("DELETE FROM documents WHERE id = $1", [documentId]);
    return NextResponse.json({ success: true, message: "删除成功" });
  } catch (error) {
    console.error("删除文档失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}
//重命名文档
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "未登录" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ success: false, message: "token 无效或已过期" }, { status: 401 });
  }

  const { documentId, filename } = await req.json();

  if (!documentId || !filename || !filename.trim()) {
    return NextResponse.json({ success: false, message: "缺少必填字段" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `UPDATE documents SET filename = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, knowledge_base_id, filename, file_type, file_size, total_chunks, created_at, updated_at`,
      [filename.trim(), documentId],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "文档不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("重命名文档失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}
