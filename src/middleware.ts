import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 后台路由保护
  if (pathname.startsWith("/admin")) {
    // 登录页面不需要认证
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // 检查认证 token
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 验证 token
    const admin = await verifyToken(token);

    if (!admin) {
      // Token 无效，清除 cookie 并重定向到登录页
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_token");
      return response;
    }

    // Token 有效，继续请求
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
