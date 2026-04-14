'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  subscriptions: Array<{
    id: string;
    plan: string;
    status: string;
    startDate: string;
    endDate: string | null;
  }>;
  conversations: Array<{
    id: string;
    title: string | null;
    createdAt: string;
    messages: Array<{
      id: string;
      content: string;
    }>;
  }>;
  bookmarks: Array<{
    id: string;
    createdAt: string;
    report: {
      id: string;
      title: string;
      category: string;
    };
  }>;
}

interface Stats {
  totalConversations: number;
  totalMessages: number;
  totalBookmarks: number;
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error('获取用户详情失败');
      }
      const result = await response.json();
      setUser(result.user);
      setStats(result.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error || !user || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">错误: {error || '用户不存在'}</div>
      </div>
    );
  }

  const roleMap: Record<string, { label: string; color: string }> = {
    ADMIN: { label: '管理员', color: 'bg-purple-100 text-purple-800' },
    PRO: { label: '专业版', color: 'bg-blue-100 text-blue-800' },
    FREE: { label: '免费版', color: 'bg-gray-100 text-gray-800' },
  };
  const role = roleMap[user.role] || roleMap.FREE;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <Link 
        href="/admin/users"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← 返回用户列表
      </Link>

      {/* 用户基本信息 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">用户详情</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">邮箱</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">姓名</p>
            <p className="text-lg font-medium">{user.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">角色</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${role.color}`}>
              {role.label}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">注册时间</p>
            <p className="text-lg font-medium">
              {new Date(user.createdAt).toLocaleString('zh-CN')}
            </p>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">对话总数</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalConversations}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">消息总数</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMessages}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">收藏总数</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookmarks}</p>
        </div>
      </div>

      {/* 订阅记录 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">订阅记录</h2>
        {user.subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">套餐</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">开始时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">结束时间</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {user.subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{sub.plan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sub.status === 'active' ? '活跃' : '已过期'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(sub.startDate).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sub.endDate ? new Date(sub.endDate).toLocaleDateString('zh-CN') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">暂无订阅记录</p>
        )}
      </div>

      {/* 最近对话 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">最近对话</h2>
        {user.conversations.length > 0 ? (
          <div className="space-y-4">
            {user.conversations.map((conv) => (
              <div key={conv.id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">{conv.title || '未命名对话'}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(conv.createdAt).toLocaleString('zh-CN')}
                </p>
                {conv.messages[0] && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {conv.messages[0].content}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">暂无对话记录</p>
        )}
      </div>

      {/* 收藏列表 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">收藏列表</h2>
        {user.bookmarks.length > 0 ? (
          <div className="space-y-3">
            {user.bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{bookmark.report.title}</p>
                  <p className="text-sm text-gray-600">{bookmark.report.category}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(bookmark.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">暂无收藏</p>
        )}
      </div>
    </div>
  );
}
