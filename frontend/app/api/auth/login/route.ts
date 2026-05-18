import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const result = await pool.query(
      "SELECT id, username, email, password_hash FROM users WHERE email = $1",
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { success: false, message: "账号或密码错误" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "账号或密码错误" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        message: "登录成功",
        user: { id: user.id, name: user.username, email: user.email },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("登录错误:", error);
    return NextResponse.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 },
    );
  }
}
