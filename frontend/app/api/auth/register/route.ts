import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { id,username, email, password } = await request.json();
    const response = await fetch(`http://localhost:3001/users?email=${email}`);
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "无法连接到用户数据库" },
        { status: 500 },
      );
    }
    const users = await response.json();
    if (users.length > 0) {
      return NextResponse.json(
        { success: false, message: "用户已存在" },
        { status: 400 },
      );
    }
    const newUser = {
      id:id,
      username:username,
      email:email,
      password:password,
    };
    const createResponse = await fetch(`http://localhost:3001/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (!createResponse.ok) {
      return NextResponse.json(
        { success: false, message: "创建用户失败" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { success: true, message: "注册成功" },
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
