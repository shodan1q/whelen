import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getConversation(id: string) {
  const conversation = await prisma.conversationLog.findUnique({
    where: { id },
  });

  if (!conversation) {
    return null;
  }

  return {
    ...conversation,
    createdAt: conversation.createdAt.toISOString(),
  };
}

export default async function ConversationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const conversation = await getConversation(params.id);

  if (!conversation) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/conversations"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回对话列表
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">对话详情</h1>
        <p className="mt-2 text-gray-600">ID: {conversation.id}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">基本信息</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">用户 ID</div>
            <div className="text-gray-900 mt-1">{conversation.userId || '匿名'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">主 Agent</div>
            <div className="text-gray-900 mt-1">{conversation.agentId}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">执行时长</div>
            <div className="text-gray-900 mt-1">{formatDuration(conversation.executionTime)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">状态</div>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  conversation.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {conversation.status === 'success' ? '成功' : '失败'}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">创建时间</div>
            <div className="text-gray-900 mt-1">{formatDate(conversation.createdAt)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">使用的 Agents</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {conversation.agentsUsed.map((agent, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {agent}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">用户问题</h2>
        <div className="prose max-w-none">
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {conversation.question}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">AI 回答</h2>
        <div className="prose max-w-none">
          {conversation.answer ? (
            <div className="bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
              {conversation.answer}
            </div>
          ) : (
            <div className="text-gray-500 italic">无回答内容</div>
          )}
        </div>
      </div>

      {conversation.status === 'error' && conversation.errorMessage && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">错误信息</h2>
          <div className="bg-red-50 p-4 rounded-lg">
            <pre className="text-sm text-red-800 whitespace-pre-wrap">
              {conversation.errorMessage}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
