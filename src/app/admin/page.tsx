"use client";

import { useEffect, useState } from "react";
import {
  UsersIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface Stats {
  totalUsers: number;
  totalArticles: number;
  totalConversations: number;
  totalCharts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalArticles: 0,
    totalConversations: 0,
    totalCharts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: "总用户数",
      value: stats.totalUsers,
      icon: UsersIcon,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "文章数量",
      value: stats.totalArticles,
      icon: DocumentTextIcon,
      color: "from-green-500 to-green-600",
    },
    {
      name: "对话记录",
      value: stats.totalConversations,
      icon: ChatBubbleLeftRightIcon,
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "图表数量",
      value: stats.totalCharts,
      icon: ChartBarIcon,
      color: "from-[#d4af37] to-[#f4d03f]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-400">
          欢迎回来，这是您的管理后台概览
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="relative overflow-hidden rounded-xl bg-[#111111] border border-[#1a1a1a] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{card.name}</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {loading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded bg-[#1a1a1a]" />
                  ) : (
                    (card.value ?? 0).toLocaleString()
                  )}
                </p>
              </div>
              <div
                className={`rounded-lg bg-gradient-to-br ${card.color} p-3`}
              >
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 快速操作 */}
      <div className="rounded-xl bg-[#111111] border border-[#1a1a1a] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">快速操作</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-4 hover:border-[#d4af37] transition-colors"
          >
            <UsersIcon className="h-5 w-5 text-[#d4af37]" />
            <span className="text-sm font-medium text-white">管理用户</span>
          </a>
          <a
            href="/admin/articles"
            className="flex items-center gap-3 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-4 hover:border-[#d4af37] transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5 text-[#d4af37]" />
            <span className="text-sm font-medium text-white">发布文章</span>
          </a>
          <a
            href="/admin/conversations"
            className="flex items-center gap-3 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-4 hover:border-[#d4af37] transition-colors"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-[#d4af37]" />
            <span className="text-sm font-medium text-white">查看对话</span>
          </a>
        </div>
      </div>

      {/* 系统信息 */}
      <div className="rounded-xl bg-[#111111] border border-[#1a1a1a] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">系统信息</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">系统版本</span>
            <span className="text-white">v1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">数据库</span>
            <span className="text-white">PostgreSQL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">运行环境</span>
            <span className="text-white">Next.js 16</span>
          </div>
        </div>
      </div>
    </div>
  );
}
