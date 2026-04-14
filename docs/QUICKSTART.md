# 🚀 Helen LangGraph 快速启动

## ⚡ 5分钟快速开始

### 1. 配置 API Key (1分钟)

编辑 `.env` 文件，添加你的 OpenAI API Key：

```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

> 💡 如果没有 API Key，访问 https://platform.openai.com/api-keys 创建

### 2. 测试 Agent 工作流 (2分钟)

```bash
pnpm tsx scripts/test-agents.ts
```

你会看到类似这样的输出：

```
🚀 Helen Agent 工作流测试

📝 测试问题 1/6:
   "最近美联储的利率政策对A股有什么影响？"

🔀 Router: 分析问题并选择 Agent...
✅ Router: 选择了 1 个 Agent: macro
🤖 宏观分析: 开始分析...
✅ 宏观分析: 分析完成 (450 字符)
🔄 Synthesizer: 整合所有 Agent 结果...
✅ Synthesizer: 综合分析完成 (380 字符)

✅ 执行完成，耗时: 3500ms
📊 调用了 1 个 Agent: macro

最终回答:
从宏观角度看，美联储维持高利率环境对A股的影响...
```

### 3. 启动开发服务器 (1分钟)

```bash
pnpm dev
```

### 4. 体验真实对话 (1分钟)

访问 http://localhost:3000/chat

试试这些问题：
- "黄金现在还能配置吗？"
- "有什么量化策略可以在震荡市中获利？"
- "新能源行业现在还值得投资吗？"

## 📊 系统架构一览

```
用户: "黄金现在还能配置吗？"
    ↓
Router: 选择 [commodity, macro]
    ↓
并行执行:
  - 大宗商品 Agent: 分析黄金供需、价格趋势
  - 宏观分析 Agent: 分析利率、美元、地缘风险
    ↓
Synthesizer: 整合两个 Agent 的分析
    ↓
返回: "黄金当前仍具备配置价值，主要基于..."
```

## 🎯 核心文件

| 文件 | 作用 |
|------|------|
| `src/lib/agents/config.ts` | Agent 配置 |
| `src/lib/agents/nodes.ts` | Agent 实现 |
| `src/lib/agents/workflow.ts` | 工作流编排 |
| `src/app/api/chat/route.ts` | API 接口 |
| `src/app/chat/page.tsx` | 聊天页面 |

## 🔧 自定义 Agent

想添加一个"加密货币 Agent"？

1. 在 `config.ts` 添加配置
2. 在 `workflow.ts` 添加节点
3. 重启服务器

就这么简单！

## 📚 完整文档

查看 `docs/LANGGRAPH_GUIDE.md` 了解更多细节。

---

**🎉 开始使用 Helen 的智能分析吧！**
