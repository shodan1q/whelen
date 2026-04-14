import { Suspense } from 'react';
import ConversationList from '@/components/admin/ConversationList';
import { prisma } from '@/lib/prisma';

async function getConversations(searchParams: {
  page?: string;
  limit?: string;
  search?: string;
  agentId?: string;
}) {
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '20');
  const skip = (page - 1) * limit;

  const where: any = {};

  if (searchParams.search) {
    where.question = {
      contains: searchParams.search,
      mode: 'insensitive',
    };
  }

  if (searchParams.agentId) {
    where.agentsUsed = {
      has: searchParams.agentId,
    };
  }

  const [conversations, totalCount] = await Promise.all([
    prisma.conversationLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.conversationLog.count({ where }),
  ]);

  return {
    conversations: conversations.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
    totalCount,
  };
}

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; search?: string; agentId?: string };
}) {
  const { conversations, totalCount } = await getConversations(searchParams);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white">对话记录</h1>
        <p className="mt-1 text-sm text-gray-400">查看和分析用户与 Helen AI 的对话记录</p>
      </div>

      {/* 对话列表 */}
      <Suspense fallback={<div className="text-gray-400">加载中...</div>}>
        <ConversationList initialData={conversations} totalCount={totalCount} />
      </Suspense>
    </div>
  );
}
