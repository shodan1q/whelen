"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  agents?: string[];
  executionTime?: number;
}

const agents = [
  { id: "macro", name: "宏观分析", description: "全球宏观经济、政策分析" },
  { id: "commodity", name: "大宗商品", description: "黄金、白银、原油等" },
  { id: "quant", name: "量化策略", description: "量化模型、技术分析" },
  { id: "risk", name: "风险管理", description: "风险评估、资产配置" },
  { id: "market", name: "市场研究", description: "行业研究、公司分析" },
  { id: "portfolio", name: "组合优化", description: "资产配置、再平衡" },
];

const agentIcons: Record<string, React.ReactElement> = {
  macro: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  commodity: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  quant: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  ),
  risk: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  market: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  portfolio: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
  ),
};

// 初始欢迎消息
const initialMessage: Message = {
  role: "assistant",
  content: "你好！我是 Helen，由多个专业 Agent 组成。你可以问我关于宏观经济、大宗商品、量化策略、风险管理、市场研究或资产配置的问题。",
};

export function ChatPreview() {
  // 为每个 Agent 独立管理消息历史
  const [messagesByAgent, setMessagesByAgent] = useState<Record<string, Message[]>>({
    macro: [initialMessage],
    commodity: [initialMessage],
    quant: [initialMessage],
    risk: [initialMessage],
    market: [initialMessage],
    portfolio: [initialMessage],
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("macro");
  const [loading, setLoading] = useState(false);

  const currentMessages = messagesByAgent[selectedAgent] || [initialMessage];

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    const targetAgent = selectedAgent; // 保存当前选中的 Agent
    setInputValue("");

    // 添加用户消息到当前 Agent 的消息历史
    setMessagesByAgent((prev) => ({
      ...prev,
      [targetAgent]: [...prev[targetAgent], { role: "user", content: userMessage }],
    }));
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          agentId: targetAgent, // 传递选中的 Agent ID
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 添加 AI 回复到发送时选中的 Agent（而不是当前选中的）
        setMessagesByAgent((prev) => ({
          ...prev,
          [targetAgent]: [
            ...prev[targetAgent],
            {
              role: "assistant",
              content: data.data.answer,
              agents: data.data.agents,
              executionTime: data.data.executionTime,
            },
          ],
        }));
      } else {
        // 错误处理
        setMessagesByAgent((prev) => ({
          ...prev,
          [targetAgent]: [
            ...prev[targetAgent],
            {
              role: "assistant",
              content: `抱歉，出现错误：${data.message || data.error}`,
            },
          ],
        }));
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      setMessagesByAgent((prev) => ({
        ...prev,
        [targetAgent]: [
          ...prev[targetAgent],
          {
            role: "assistant",
            content: "抱歉，网络连接失败，请稍后重试。",
          },
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentAgent = agents.find((a) => a.id === selectedAgent) || agents[0];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card-glow rounded-2xl bg-[var(--bg-card)] overflow-hidden">
        {/* 头部 */}
        <div className="border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-light)]">
                <span className="text-sm font-bold text-[var(--bg-primary)]">H</span>
              </div>
              <div>
                <span className="text-sm font-medium">Helen 的 OpenClaw Agent 分身</span>
                <span className="ml-2 inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-green)]" />
                  <span className="text-xs text-[var(--text-muted)]">6个专业 Agent 在线</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <svg className="w-3.5 h-3.5 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-xs font-medium text-[var(--text-secondary)]">Powered by OpenClaw</span>
            </div>
          </div>

          {/* Agent 选择器 */}
          <div className="px-6 pb-4">
            <div className="flex gap-2 overflow-x-auto">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    selectedAgent === agent.id
                      ? "bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <span className={selectedAgent === agent.id ? "text-[var(--accent-gold)]" : "text-[var(--text-muted)]"}>
                    {agentIcons[agent.id]}
                  </span>
                  <span>{agent.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">当前 Agent：{currentAgent.description}</p>
          </div>
        </div>

        {/* 消息列表 */}
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentMessages.map((msg, i) => (
              <motion.div
                key={`${selectedAgent}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 text-[var(--text-primary)]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* 显示调用的 Agent 和执行时间 */}
                  {msg.agents && msg.agents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      <span>调用了 {msg.agents.length} 个 Agent: {msg.agents.join(", ")}</span>
                      {msg.executionTime && (
                        <span className="ml-2">· 耗时 {(msg.executionTime / 1000).toFixed(1)}s</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 加载动画 */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-[var(--bg-secondary)] rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>Helen 正在分析...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 输入框 */}
        <div className="border-t border-[var(--border-color)] px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`问 ${currentAgent.name} Agent...`}
              disabled={loading}
              className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || loading}
              className="rounded-lg bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] px-4 py-2.5 text-sm font-medium text-[var(--bg-primary)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发送
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Helen 由多个 OpenClaw Agent 组成，可回答不同领域的专业问题。分析仅供参考，不构成投资建议。
          </p>
        </div>
      </div>
    </div>
  );
}
