"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "仪表盘", href: "/admin", icon: HomeIcon },
  { name: "用户管理", href: "/admin/users", icon: UsersIcon },
  { name: "文章管理", href: "/admin/articles", icon: DocumentTextIcon },
  { name: "图表管理", href: "/admin/charts", icon: ChartBarIcon },
  { name: "对话记录", href: "/admin/conversations", icon: ChatBubbleLeftRightIcon },
  { name: "系统设置", href: "/admin/settings", icon: Cog6ToothIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 登录页面不使用后台布局
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 登录页面直接渲染子组件
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#111111] border-r border-[#1a1a1a] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-[#1a1a1a]">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] overflow-hidden">
                <span className="text-lg font-bold text-[#d4af37]">H</span>
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-[#d4af37]/30 to-transparent" />
              </div>
              <div>
                <span className="text-lg font-semibold bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">
                  问海伦
                </span>
                <span className="ml-2 text-xs text-gray-500">管理后台</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#d4af37]/10 text-[#d4af37]"
                      : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 底部退出按钮 */}
          <div className="border-t border-[#1a1a1a] p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-[#1a1a1a] hover:text-red-400"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              退出登录
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="lg:pl-64">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-xl px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* 面包屑 */}
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-[#d4af37] transition-colors"
            >
              管理后台
            </Link>
            {pathname !== "/admin" && (
              <>
                <span className="text-gray-600">/</span>
                <span className="text-white">
                  {navigation.find((item) => item.href === pathname)?.name ||
                    "页面"}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors"
            >
              查看前台
            </Link>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="min-h-screen bg-[#0a0a0a] p-6">{children}</main>
      </div>
    </div>
  );
}
