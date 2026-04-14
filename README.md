# 问海伦 (Ask Helen) - AI 金融分析平台

> Helen 是一位资深的宏观/量化分析师，这里是她在金融领域多年的沉淀。

## 🚀 快速开始

### 1. 配置 API Key
```bash
# 编辑 .env 文件
OPENAI_API_KEY=sk-your-key-here
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm dev
```

### 4. 访问应用
- 首页: http://localhost:3000
- 聊天: http://localhost:3000/chat
- 指标: http://localhost:3000/indicators
- 数据: http://localhost:3000/market
- 书籍: http://localhost:3000/library
- 日常: http://localhost:3000/daily
- 每日一图: http://localhost:3000/chart

## 🤖 Helen 的 OpenClaw Agent 分身

基于 LangGraph 的多 Agent 系统，6个专业 Agent 协同工作：

| Agent | 领域 | 关键词 |
|-------|------|--------|
| 宏观分析 | 全球宏观经济、政策分析 | 美联储、利率、GDP、通胀 |
| 大宗商品 | 黄金、白银、原油等 | 黄金、白银、原油、铜 |
| 量化策略 | 量化模型、技术分析 | 量化、回测、夏普比率 |
| 风险管理 | 风险评估、资产配置 | VaR、波动率、Beta |
| 市场研究 | 行业研究、公司分析 | 行业、公司、估值 |
| 组合优化 | 资产配置、再平衡 | 配置、再平衡、权重 |

## 📊 系统架构

```
用户问题
    ↓
Router Agent (智能路由)
    ↓
6个专业 Agent (并行执行)
    ↓
Synthesizer Agent (结果综合)
    ↓
最终回答
```

## 🧪 测试

```bash
# 测试 Agent 工作流
pnpm tsx scripts/test-agents.ts

# 运行开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📚 文档

- [完整指南](docs/LANGGRAPH_GUIDE.md) - 详细使用文档
- [快速启动](docs/QUICKSTART.md) - 5分钟上手
- [最佳实践](docs/BEST_PRACTICES.md) - 使用示例和优化技巧
- [搭建完成](docs/SETUP_COMPLETE.md) - 系统搭建总结

## 🛠️ 技术栈

- **前端**: Next.js 16 + TypeScript + Tailwind CSS
- **AI**: LangGraph + LangChain + OpenAI GPT-4
- **数据库**: PostgreSQL + Prisma
- **3D**: Three.js + React Three Fiber
- **动画**: Framer Motion
- **数据源**: Binance API + Yahoo Finance API

## 📁 项目结构

```
whelen/
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── api/chat/          # Agent API 路由
│   │   ├── chat/              # 聊天页面
│   │   ├── indicators/        # K线指标页面
│   │   ├── market/            # 市场数据页面
│   │   ├── library/           # 书籍页面
│   │   ├── daily/             # 日常文章页面
│   │   └── chart/             # 每日一图页面
│   ├── lib/
│   │   └── agents/            # LangGraph Agent 系统
│   │       ├── config.ts      # Agent 配置
│   │       ├── nodes.ts       # Agent 节点
│   │       └── workflow.ts    # 工作流编排
│   └── components/            # React 组件
├── scripts/
│   └── test-agents.ts         # Agent 测试脚本
├── docs/                      # 文档
└── public/                    # 静态资源
```

## 🎯 核心功能

### 1. AI 对话 (`/chat`)
- 6个专业 Agent 协同分析
- 智能路由选择相关 Agent
- 实时显示执行过程
- 支持多轮对话

### 2. K线指标 (`/indicators`)
- 11个品种实时数据
- 6种时间周期
- Canvas 手绘风格
- Binance + Yahoo Finance 数据源

### 3. 市场数据 (`/market`)
- 全球市场实时行情
- 分类展示（指数/商品/加密/外汇/债券）
- 涨跌幅实时更新

### 4. 书籍库 (`/library`)
- 15本交易投资书籍
- 视频/文案/书摘分类
- 点击查看详情

### 5. 日常文章 (`/daily`)
- 黄金相关宏观分析
- 有色相关个股研究
- 来自今日头条"我爱分析的笔记"

### 6. 每日一图 (`/chart`)
- 市场预测与实际走势对比
- 图片网格展示
- 点击全屏查看

## 🔧 开发

### 环境变量

```bash
# .env
DATABASE_URL="postgresql://shodan@localhost:5432/whelen"
OPENAI_API_KEY="sk-your-key-here"
```

### 数据库

```bash
# 创建数据库
createdb whelen

# 运行迁移
pnpm prisma migrate dev

# 打开 Prisma Studio
pnpm prisma studio
```

### 代理配置

Binance 和 Yahoo Finance API 需要代理（国内被墙）：

```typescript
// 本地代理: http://127.0.0.1:7890
```

## 📈 性能指标

- **Agent 响应时间**: 3-5秒
- **Token 消耗**: 500-1500 tokens/问题
- **并行执行**: 多 Agent 同时工作
- **K线数据**: 实时更新（无模拟数据）

## 🚧 待开发功能

- [ ] 对话历史记忆
- [ ] RAG 知识库（15本书籍内容）
- [ ] 实时市场数据推送
- [ ] 用户认证系统
- [ ] 个性化推荐
- [ ] LangGraph Studio 可视化
- [ ] 性能监控和优化

## 📝 License

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**Powered by OpenClaw Multi-Agent System** 🤖✨
