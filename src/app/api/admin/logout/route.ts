import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookie();

    return NextResponse.json({
      success: true,
      message: "登出成功",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "登出失败" },
      { status: 500 }
    );
  }
}
