# Helen LangGraph 多 Agent 系统

## 🎯 系统架构

```
用户问题
    ↓
[Router Agent] → 分析问题，选择1-3个相关 Agent
    ↓
    ├─→ [宏观分析 Agent]
    ├─→ [大宗商品 Agent]
    ├─→ [量化策略 Agent]
    ├─→ [风险管理 Agent]
    ├─→ [市场研究 Agent]
    └─→ [组合优化 Agent]
    ↓
[Synthesizer Agent] → 整合所有结果，生成最终回答
    ↓
返回给用户
```

## 📦 已安装的依赖

- `@langchain/langgraph` - LangGraph 核心
- `@langchain/openai` - OpenAI 集成
- `@langchain/core` - LangChain 核心
- `langchain` - LangChain 主包
- `zod` - 类型验证
- `tsx` - TypeScript 执行器（开发依赖）

## 🔧 配置步骤

### 1. 配置 OpenAI API Key

编辑 `.env` 文件：

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 2. 测试 Agent 工作流

```bash
# 运行测试脚本
pnpm tsx scripts/test-agents.ts
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000/chat 开始对话！

## 📁 文件结构

```
src/lib/agents/
├── config.ts          # Agent 配置和类型定义
├── nodes.ts           # 各个 Agent 节点实现
└── workflow.ts        # LangGraph 工作流编排

src/app/api/chat/
└── route.ts           # API 路由

src/app/chat/
└── page.tsx           # 聊天页面

scripts/
└── test-agents.ts     # 测试脚本
```

## 🤖 6个专业 Agent

### 1. 宏观分析 Agent (macro)
- **关键词**: 美联储、利率、GDP、通胀、央行、货币政策
- **功能**: 全球宏观经济分析、政策解读、经济周期判断

### 2. 大宗商品 Agent (commodity)
- **关键词**: 黄金、白银、原油、铜、贵金属、能源
- **功能**: 大宗商品供需分析、价格趋势、配置建议

### 3. 量化策略 Agent (quant)
- **关键词**: 量化、策略、回测、夏普比率、网格、套利
- **功能**: 量化模型、技术分析、策略回测

### 4. 风险管理 Agent (risk)
- **关键词**: 风险、VaR、波动率、Beta、对冲、止损
- **功能**: 风险评估、组合分析、对冲策略

### 5. 市场研究 Agent (market)
- **关键词**: 行业、公司、估值、新能源、科技、消费
- **功能**: 行业分析、公司研究、估值评估

### 6. 组合优化 Agent (portfolio)
- **关键词**: 配置、组合、再平衡、分散、权重
- **功能**: 资产配置、组合优化、再平衡策略

## 🔄 工作流程

1. **Router 阶段**: 
   - 使用 GPT-4 分析用户问题
   - 根据关键词匹配选择1-3个相关 Agent
   - 如果没有匹配，默认使用宏观分析 Agent

2. **并行执行阶段**:
   - 所有选中的 Agent 并行执行
   - 未选中的 Agent 自动跳过
   - 每个 Agent 独立分析问题

3. **综合阶段**:
   - Synthesizer Agent 整合所有结果
   - 提取核心观点
   - 给出具体建议
   - 提示风险因素

## 📊 API 使用

### 请求

```bash
POST /api/chat
Content-Type: application/json

{
  "message": "黄金现在还能配置吗？"
}
```

### 响应

```json
{
  "success": true,
  "data": {
    "answer": "黄金当前仍具备配置价值...",
    "agents": ["commodity", "macro"],
    "executionTime": 3500,
    "timestamp": 1709654400000
  }
}
```

## 🧪 测试示例

```typescript
import { askHelen } from "@/lib/agents/workflow";

const result = await askHelen("最近美联储的利率政策对A股有什么影响？");

console.log(result.answer);        // 最终回答
console.log(result.agents);        // ["macro"]
console.log(result.executionTime); // 3500 (ms)
```

## 🎨 自定义 Agent

### 添加新的 Agent

1. 在 `config.ts` 中添加配置：

```typescript
{
  id: "crypto",
  name: "加密货币",
  description: "比特币、以太坊等加密货币分析",
  keywords: ["比特币", "以太坊", "加密货币", "区块链"],
  systemPrompt: "你是 Helen 的加密货币分析 Agent...",
}
```

2. 在 `nodes.ts` 中创建节点：

```typescript
export const cryptoNode = createAgentNode("crypto");
```

3. 在 `workflow.ts` 中添加到工作流：

```typescript
workflow.addNode("crypto", cryptoNode);
workflow.addEdge("router", "crypto");
workflow.addEdge("crypto", "synthesizer");
```

## 🔍 调试技巧

### 1. 查看控制台日志

工作流执行时会输出详细日志：

```
🔀 Router: 分析问题并选择 Agent...
✅ Router: 选择了 2 个 Agent: commodity, macro
🤖 大宗商品: 开始分析...
✅ 大宗商品: 分析完成 (450 字符)
🔄 Synthesizer: 整合所有 Agent 结果...
✅ Synthesizer: 综合分析完成 (380 字符)
```

### 2. 使用测试脚本

修改 `scripts/test-agents.ts` 中的 `questionIndex` 测试不同问题。

### 3. 调整 Agent 参数

在 `nodes.ts` 中修改 LLM 配置：

```typescript
const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini",  // 或 "gpt-4"
  temperature: 0.7,           // 0-1，越高越创造性
});
```

## ⚡ 性能优化

### 1. 并行执行
所有选中的 Agent 并行执行，不会串行等待。

### 2. 智能路由
只执行相关的 Agent，避免不必要的 API 调用。

### 3. 缓存策略（待实现）
可以添加 Redis 缓存常见问题的回答。

## 🚀 下一步

### Phase 1: 基础功能（已完成）
- ✅ 6个专业 Agent
- ✅ 智能路由
- ✅ 并行执行
- ✅ 结果综合
- ✅ API 接口
- ✅ 聊天页面

### Phase 2: 增强功能（待实现）
- [ ] 对话历史记忆
- [ ] RAG 知识库（15本书籍）
- [ ] 实时市场数据接入
- [ ] 用户偏好学习

### Phase 3: 高级功能（待实现）
- [ ] LangGraph Studio 可视化调试
- [ ] 人工介入决策
- [ ] A/B 测试不同 Prompt
- [ ] 性能监控和优化

## 📚 相关资源

- [LangGraph 官方文档](https://langchain-ai.github.io/langgraph/)
- [LangChain 文档](https://js.langchain.com/)
- [OpenAI API 文档](https://platform.openai.com/docs)

## 🐛 常见问题

### Q: API 返回 "OpenAI API key not configured"
A: 检查 `.env` 文件中的 `OPENAI_API_KEY` 是否正确配置。

### Q: 执行时间过长
A: 
1. 检查网络连接
2. 考虑使用 `gpt-4o-mini` 替代 `gpt-4`
3. 减少选中的 Agent 数量

### Q: 回答质量不理想
A: 
1. 优化 Agent 的 `systemPrompt`
2. 调整 `temperature` 参数
3. 在 Synthesizer 中添加更详细的整合逻辑

---

**🎉 恭喜！Helen 的 LangGraph 多 Agent 系统已经搭建完成！**

现在你可以：
1. 配置 OpenAI API Key
2. 运行测试脚本验证
3. 启动开发服务器体验真实对话
4. 根据需求自定义和扩展 Agent
