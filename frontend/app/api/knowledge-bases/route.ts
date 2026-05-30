import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
//创建知识库
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "未登录" }, { status: 401 });
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ success: false, message: "token 无效或已过期" }, { status: 401 });
  }

  const { name, description } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json({ success: false, message: "名称不能为空" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO knowledge_bases (user_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, name, description, created_at, updated_at`,
      [userId, name.trim(), description?.trim() || null],
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("创建知识库失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}
//更新知识库
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

  const { id, name, description } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false, message: "缺少知识库 id" }, { status: 400 });
  }
  if (!name || !name.trim()) {
    return NextResponse.json({ success: false, message: "名称不能为空" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `UPDATE knowledge_bases SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, user_id, name, description, created_at, updated_at`,
      [name.trim(), description?.trim() || null, id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "知识库不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("修改知识库失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}
//删除知识库
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

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, message: "缺少知识库 id" }, { status: 400 });
  }

  try {
    await pool.query("DELETE FROM knowledge_bases WHERE id = $1", [id]);
    return NextResponse.json({ success: true, message: "删除成功" });
  } catch (error) {
    console.error("删除知识库失败:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}
