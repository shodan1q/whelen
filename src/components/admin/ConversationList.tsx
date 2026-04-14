'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ConversationLog {
  id: string;
  userId: string | null;
  agentId: string;
  question: string;
  answer: string | null;
  agentsUsed: string[];
  executionTime: number | null;
  status: string;
  createdAt: string;
}

interface ConversationListProps {
  initialData: ConversationLog[];
  totalCount: number;
}

export default function ConversationList({ initialData, totalCount }: ConversationListProps) {
  const [conversations, setConversations] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 20;

  // 获取所有使用过的 Agent
  const allAgents = Array.from(
    new Set(conversations.flatMap(c => c.agentsUsed))
  ).sort();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: pageSize.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(selectedAgent !== 'all' && { agentId: selectedAgent }),
      });

      const response = await fetch(`/api/admin/conversations?${params}`);
      const data = await response.json();
      
      setConversations(data.conversations);
      setCurrentPage(1);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(selectedAgent !== 'all' && { agentId: selectedAgent }),
      });

      const response = await fetch(`/api/admin/conversations?${params}`);
      const data = await response.json();
      
      setConversations(data.conversations);
      setCurrentPage(page);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="搜索问题关键词..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 px-4 py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
        />
        
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
        >
          <option value="all">所有 Agent</option>
          {allAgents.map(agent => (
            <option key={agent} value={agent}>{agent}</option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isLoading ? '搜索中...' : '搜索'}
        </button>
      </div>

      {/* 统计信息 */}
      <div className="text-sm text-gray-400">
        共 {totalCount} 条对话记录
      </div>

      {/* 对话列表 */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#1a1a1a]">
            <thead className="bg-[#0a0a0a]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  问题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  执行时长
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {conversations.map((conv) => (
                <tr key={conv.id} className="hover:bg-[#0a0a0a] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm text-white max-w-md truncate">
                      {conv.question}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {conv.agentsUsed.map((agent, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        >
                          {agent}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {formatDuration(conv.executionTime)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        conv.status === 'success'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      {conv.status === 'success' ? '成功' : '失败'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {formatDate(conv.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/admin/conversations/${conv.id}`}
                      className="text-[#d4af37] hover:text-[#f4d03f] transition-colors"
                    >
                      查看详情
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white hover:border-[#d4af37]/30 disabled:opacity-50 transition-colors"
          >
            上一页
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] border-transparent'
                      : 'bg-[#111111] border-[#1a1a1a] text-white hover:border-[#d4af37]/30'
                  } disabled:opacity-50`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white hover:border-[#d4af37]/30 disabled:opacity-50 transition-colors"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
