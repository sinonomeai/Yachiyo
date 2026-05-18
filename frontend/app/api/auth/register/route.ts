import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: "用户已存在" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword],
    );


    return NextResponse.json(
      {
        success: true,
        message: "注册成功",
        user: { username, email },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("注册错误:", error);
    return NextResponse.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 },
    );
  }
}
