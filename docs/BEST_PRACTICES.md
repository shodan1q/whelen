# Helen Agent 使用示例和最佳实践

## 📝 测试问题示例

### 1. 宏观分析 Agent

**问题：**
```
最近美联储的利率政策对A股有什么影响？
```

**预期调用：** `macro`

**回答要点：**
- 资金面分析（中美利差、外资流动）
- 汇率传导（人民币汇率、央行政策空间）
- 估值修复（A股估值水平、修复空间）
- 投资建议（配置方向）

---

### 2. 大宗商品 Agent

**问题：**
```
黄金现在还能配置吗？
```

**预期调用：** `commodity`, `macro`

**回答要点：**
- 央行购金潮（全球央行增持数据）
- 实际利率（美国实际利率水平）
- 地缘风险（全球不确定性）
- 配置建议（比例、时机）

---

### 3. 量化策略 Agent

**问题：**
```
有什么量化策略可以在震荡市中获利？
```

**预期调用：** `quant`

**回答要点：**
- 网格交易（区间高抛低吸）
- 统计套利（价差回归）
- 动量反转（短期动量+中期反转）
- 风险控制（回撤、夏普比率）

---

### 4. 风险管理 Agent

**问题：**
```
如何评估当前组合的风险敞口？
```

**预期调用：** `risk`

**回答要点：**
- 市场风险（Beta、市场敏感度）
- 汇率风险（外币资产占比）
- 波动率（年化波动率水平）
- 尾部风险（VaR、极端情况损失）

---

### 5. 市场研究 Agent

**问题：**
```
新能源行业现在还值得投资吗？
```

**预期调用：** `market`

**回答要点：**
- 行业现状（光伏、储能、新能源车）
- 竞争格局（产能、估值、增速）
- 投资机会（细分赛道、龙头企业）
- 风险提示（产能过剩、政策变化）

---

### 6. 组合优化 Agent

**问题：**
```
我的组合需要再平衡吗？
```

**预期调用：** `portfolio`, `risk`

**回答要点：**
- 当前组合分析（资产配置、权重）
- 优化建议（调整方向、比例）
- 预期收益风险（年化收益、波动率）
- 实施步骤（调仓时机、成本）

---

## 🎯 最佳实践

### 1. 问题设计

**✅ 好的问题：**
- 具体明确："黄金现在还能配置吗？"
- 有明确领域："新能源行业现在还值得投资吗？"
- 可操作："我的组合需要再平衡吗？"

**❌ 不好的问题：**
- 过于宽泛："怎么投资？"
- 缺乏上下文："这个怎么样？"
- 多个问题混杂："黄金和A股哪个好，还有美股呢？"

---

### 2. Agent 选择策略

**单 Agent 场景：**
- 问题聚焦单一领域
- 例如："美联储加息对市场的影响" → `macro`

**多 Agent 场景：**
- 问题涉及多个维度
- 例如："黄金配置建议" → `commodity` + `macro`
- 例如："组合再平衡" → `portfolio` + `risk`

**Router 自动选择：**
- 让 Router Agent 根据关键词和语义自动判断
- 通常选择 1-3 个最相关的 Agent

---

### 3. Prompt 优化技巧

**Agent systemPrompt 设计：**
```typescript
{
  systemPrompt: `你是 Helen 的[领域] Agent。
  
专长：[核心能力]

分析框架：
1. [维度1]
2. [维度2]
3. [维度3]
4. [维度4]

回答要求：
- 数据支撑（引用具体数据）
- 逻辑清晰（因果关系）
- 结论明确（投资建议）
- 风险提示（不确定性）`
}
```

**关键要素：**
- 明确角色定位
- 清晰的分析框架
- 具体的回答要求
- 专业术语和数据支撑

---

### 4. 性能优化

**减少响应时间：**
1. 使用 `gpt-4o-mini` 替代 `gpt-4`（快3-5倍）
2. 限制 Router 选择的 Agent 数量（1-2个）
3. 优化 systemPrompt 长度（保持简洁）

**降低成本：**
1. 开发阶段使用 `gpt-4o-mini`
2. 缓存常见问题的回答
3. 合并相似的 Agent（减少重复调用）

**提高质量：**
1. 生产环境使用 `gpt-4`
2. 增加 Synthesizer 的整合逻辑
3. 添加 RAG 知识库支持

---

### 5. 错误处理

**常见错误：**

**1. OpenAI API Key 未配置**
```
Error: OpenAI API key not configured
解决：在 .env 中配置 OPENAI_API_KEY
```

**2. 网络超时**
```
Error: Request timeout
解决：检查网络连接，增加 timeout 时间
```

**3. Token 超限**
```
Error: Token limit exceeded
解决：减少 systemPrompt 长度，使用更大的模型
```

**4. Agent 返回空结果**
```
解决：检查 Agent 的 systemPrompt，确保有明确的输出要求
```

---

### 6. 调试技巧

**查看执行日志：**
```bash
# 终端会输出详细日志
🔀 Router: 分析问题并选择 Agent...
✅ Router: 选择了 2 个 Agent: commodity, macro
🤖 大宗商品: 开始分析...
✅ 大宗商品: 分析完成 (450 字符)
```

**使用测试脚本：**
```bash
# 修改 scripts/test-agents.ts 中的问题
const questionIndex = 0; // 改为 1, 2, 3...

# 运行测试
pnpm tsx scripts/test-agents.ts
```

**检查 Agent 结果：**
```typescript
const result = await askHelen("问题");
console.log(result.agents);        // 调用的 Agent
console.log(result.results);       // 各 Agent 的详细结果
console.log(result.executionTime); // 执行时间
```

---

### 7. 扩展 Agent

**添加新 Agent 的步骤：**

1. 在 `config.ts` 添加配置：
```typescript
{
  id: "crypto",
  name: "加密货币",
  description: "比特币、以太坊等加密货币分析",
  keywords: ["比特币", "以太坊", "加密货币", "区块链"],
  systemPrompt: "你是 Helen 的加密货币分析 Agent...",
}
```

2. 在 `nodes.ts` 创建节点：
```typescript
export const cryptoNode = createAgentNode("crypto");
```

3. 在 `workflow.ts` 添加到工作流：
```typescript
workflow.addNode("crypto", cryptoNode);
workflow.addEdge("router", "crypto");
workflow.addEdge("crypto", "synthesizer");
```

4. 重启服务器测试

---

### 8. 生产部署建议

**环境变量：**
```bash
# .env.production
OPENAI_API_KEY=sk-prod-key-here
NODE_ENV=production
```

**性能监控：**
- 使用 LangSmith 追踪每次调用
- 记录响应时间和 Token 消耗
- 设置告警阈值

**缓存策略：**
- Redis 缓存常见问题
- 设置 TTL（如 1小时）
- 缓存 key: `hash(question)`

**限流保护：**
- 单用户限流（如 10次/分钟）
- 全局限流（如 100次/分钟）
- 使用队列处理高峰

---

## 🔍 常见问题排查

### Q: Agent 没有被调用
**检查：**
1. 问题中是否包含 Agent 的关键词
2. Router 的选择逻辑是否正确
3. 查看控制台日志确认 Router 的选择

### Q: 回答质量不理想
**优化：**
1. 调整 Agent 的 systemPrompt
2. 增加具体的分析框架
3. 要求引用数据和案例
4. 使用 `gpt-4` 替代 `gpt-4o-mini`

### Q: 响应时间过长
**优化：**
1. 减少选中的 Agent 数量
2. 使用 `gpt-4o-mini`
3. 优化 systemPrompt 长度
4. 检查网络连接

### Q: Token 消耗过大
**优化：**
1. 精简 systemPrompt
2. 减少 Agent 数量
3. 使用缓存
4. 合并相似问题

---

## 📊 性能基准

**单 Agent 调用：**
- 响应时间: 2-3秒
- Token 消耗: 300-500 tokens

**双 Agent 调用：**
- 响应时间: 3-4秒
- Token 消耗: 600-1000 tokens

**三 Agent 调用：**
- 响应时间: 4-5秒
- Token 消耗: 900-1500 tokens

**模型对比：**
- `gpt-4o-mini`: 快，便宜，质量中等
- `gpt-4`: 慢，贵，质量高

---

## 🎓 学习资源

- [LangGraph 官方文档](https://langchain-ai.github.io/langgraph/)
- [LangChain 文档](https://js.langchain.com/)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [LangSmith 监控](https://smith.langchain.com/)

---

**💡 提示：** 根据实际使用情况持续优化 Agent 的 systemPrompt 和工作流程！
