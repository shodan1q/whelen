"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface Message {
  role: "user" | "assistant";
  content: string;
  agents?: string[];
  executionTime?: number;
}

export default function ChatPage() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 设置初始消息
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: t("chat.greeting") }]);
    }
  }, [t, messages.length]);

  useEffect(() => {
    // 自动滚动到底部
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    // 添加用户消息
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.success) {
        // 添加 AI 回复
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: data.data.answer,
            agents: data.data.agents,
            executionTime: data.data.executionTime,
          },
        ]);
      } else {
        // 错误处理
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: `抱歉，出现错误：${data.message || data.error}`,
          },
        ]);
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，网络连接失败，请稍后重试。",
        },
      ]);
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

  return (
    <div className="min-h-screen pt-24 pb-8 bg-grid-ocean">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 h-[calc(100vh-8rem)] flex flex-col">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gradient-gold mb-2">
            {t("chat.title")}
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-green)]" />
            <span className="text-sm text-[var(--text-muted)]">
              {t("chat.status")}
            </span>
          </div>
        </motion.div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 card-glow rounded-2xl bg-[var(--bg-card)] p-6">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 text-[var(--text-primary)]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  
                  {/* 显示调用的 Agent 和执行时间 */}
                  {msg.agents && msg.agents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      <span>
                        调用了 {msg.agents.length} 个 Agent: {msg.agents.join(", ")}
                      </span>
                      {msg.executionTime && (
                        <span className="ml-2">
                          · 耗时 {(msg.executionTime / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 加载动画 */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[var(--bg-secondary)] rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>{t("chat.analyzing")}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* 输入框 */}
        <div className="card-glow rounded-xl bg-[var(--bg-card)] p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("chat.placeholder")}
              rows={1}
              className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)] focus:outline-none transition-colors resize-none"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="rounded-lg bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] px-6 py-3 text-sm font-medium text-[var(--bg-primary)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("chat.send")}
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {t("chat.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
