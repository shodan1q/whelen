import { Suspense } from 'react';
import AgentStatsChart from '@/components/admin/AgentStatsChart';
import { prisma } from '@/lib/prisma';

async function getAgentStats() {
  const conversations = await prisma.conversationLog.findMany({
    select: {
      agentId: true,
      agentsUsed: true,
      executionTime: true,
      status: true,
    },
  });

  const agentMap = new Map<string, {
    totalCalls: number;
    successCalls: number;
    failedCalls: number;
    totalExecutionTime: number;
    executionCount: number;
  }>();

  conversations.forEach(conv => {
    const agents = Array.from(new Set([conv.agentId, ...conv.agentsUsed]));
    
    agents.forEach(agentId => {
      if (!agentMap.has(agentId)) {
        agentMap.set(agentId, {
          totalCalls: 0,
          successCalls: 0,
          failedCalls: 0,
          totalExecutionTime: 0,
          executionCount: 0,
        });
      }

      const stats = agentMap.get(agentId)!;
      stats.totalCalls++;
      
      if (conv.status === 'success') {
        stats.successCalls++;
      } else {
        stats.failedCalls++;
      }

      if (conv.executionTime) {
        stats.totalExecutionTime += conv.executionTime;
        stats.executionCount++;
      }
    });
  });

  const stats = Array.from(agentMap.entries()).map(([agentId, data]) => ({
    agentId,
    totalCalls: data.totalCalls,
    successCalls: data.successCalls,
    failedCalls: data.failedCalls,
    avgExecutionTime: data.executionCount > 0 
      ? Math.round(data.totalExecutionTime / data.executionCount)
      : 0,
    successRate: data.totalCalls > 0
      ? (data.successCalls / data.totalCalls) * 100
      : 0,
  }));

  stats.sort((a, b) => b.totalCalls - a.totalCalls);

  return stats;
}

async function getPopularQuestions() {
  const questions = await prisma.conversationLog.groupBy({
    by: ['question'],
    _count: {
      question: true,
    },
    orderBy: {
      _count: {
        question: 'desc',
      },
    },
    take: 10,
  });

  return questions.map(q => ({
    question: q.question,
    count: q._count.question,
  }));
}

export default async function AgentsPage() {
  const [stats, popularQuestions] = await Promise.all([
    getAgentStats(),
    getPopularQuestions(),
  ]);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white">Agent 统计</h1>
        <p className="mt-1 text-sm text-gray-400">查看各个 Agent 的使用情况和性能指标</p>
      </div>

      {/* Agent 统计图表 */}
      <Suspense fallback={<div className="text-gray-400">加载中...</div>}>
        <AgentStatsChart stats={stats} />
      </Suspense>

      {/* 热门问题 */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">热门问题 Top 10</h2>
        <div className="space-y-3">
          {popularQuestions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">暂无数据</div>
          ) : (
            popularQuestions.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-[#d4af37]/30 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-white">{item.question}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    被问 {item.count} 次
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
