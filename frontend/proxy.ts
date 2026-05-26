import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (request.nextUrl.pathname.startsWith("/yachiyo")) {
    if (!token) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  return NextResponse.next();
}
