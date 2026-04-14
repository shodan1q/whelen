# 🚀 问海伦平台 - 部署检查清单

## ✅ 开发环境检查

### 1. 依赖安装
- [x] Node.js 23.11.0
- [x] pnpm 10.8.0
- [x] PostgreSQL (本地)
- [x] LangChain 相关包 (6个)

### 2. 环境变量
- [ ] `OPENAI_API_KEY` - **需要配置**
- [x] `DATABASE_URL` - 已配置

### 3. 数据库
- [x] 数据库创建 (`whelen`)
- [x] Prisma schema 定义
- [x] 迁移文件

### 4. 核心功能
- [x] LangGraph 工作流
- [x] 6个专业 Agent
- [x] API 路由 (`/api/chat`)
- [x] 聊天页面 (`/chat`)
- [x] K线数据 (11个品种)
- [x] 市场数据
- [x] 书籍库 (15本)
- [x] 日常文章 (10篇)
- [x] 每日一图

---

## 🧪 测试检查

### 1. Agent 工作流测试
```bash
# 配置 OPENAI_API_KEY 后运行
pnpm tsx scripts/test-agents.ts
```

**预期结果：**
- ✅ Router 成功选择 Agent
- ✅ Agent 并行执行
- ✅ Synthesizer 整合结果
- ✅ 返回最终回答

### 2. 页面访问测试
```bash
pnpm dev
```

**检查页面：**
- [ ] http://localhost:3000 - 首页
- [ ] http://localhost:3000/chat - 聊天（需 API Key）
- [ ] http://localhost:3000/indicators - K线指标
- [ ] http://localhost:3000/market - 市场数据
- [ ] http://localhost:3000/library - 书籍库
- [ ] http://localhost:3000/daily - 日常文章
- [ ] http://localhost:3000/chart - 每日一图

### 3. API 测试
```bash
# 测试聊天 API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"黄金现在还能配置吗？"}'
```

**预期结果：**
```json
{
  "success": true,
  "data": {
    "answer": "黄金当前仍具备配置价值...",
    "agents": ["commodity", "macro"],
    "executionTime": 3500
  }
}
```

---

## 📦 生产部署准备

### 1. 环境变量（生产）
```bash
# .env.production
DATABASE_URL="postgresql://user:pass@host:5432/whelen"
OPENAI_API_KEY="sk-prod-key-here"
NODE_ENV="production"
NEXT_PUBLIC_API_URL="https://whelen.com"
```

### 2. 构建检查
```bash
# 构建生产版本
pnpm build

# 检查构建输出
ls -lh .next/
```

**预期：**
- ✅ 无编译错误
- ✅ 所有页面成功构建
- ✅ API 路由正常

### 3. 性能优化
- [ ] 启用 Next.js 缓存
- [ ] 配置 CDN（静态资源）
- [ ] 启用 gzip/brotli 压缩
- [ ] 配置 Redis 缓存（Agent 回答）
- [ ] 设置 API 限流

### 4. 安全检查
- [ ] API Key 不暴露在前端
- [ ] 环境变量安全存储
- [ ] CORS 配置
- [ ] Rate limiting
- [ ] SQL 注入防护（Prisma 自动处理）

### 5. 监控和日志
- [ ] 配置 LangSmith（Agent 追踪）
- [ ] 配置错误监控（Sentry）
- [ ] 配置性能监控（Vercel Analytics）
- [ ] 配置日志收集

---

## 🌐 部署选项

### 选项 1: Vercel（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 配置环境变量
vercel env add OPENAI_API_KEY
vercel env add DATABASE_URL
```

**优点：**
- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动扩展

**注意：**
- 需要外部 PostgreSQL（Vercel Postgres 或 Supabase）
- Serverless 函数有 10秒超时限制（Agent 可能超时）

### 选项 2: 自托管（VPS）
```bash
# 构建
pnpm build

# 启动
pnpm start

# 使用 PM2 管理
pm2 start npm --name "whelen" -- start
pm2 save
pm2 startup
```

**优点：**
- ✅ 完全控制
- ✅ 无超时限制
- ✅ 可配置代理

**注意：**
- 需要配置 Nginx
- 需要配置 SSL 证书
- 需要手动扩展

### 选项 3: Docker
```dockerfile
# Dockerfile
FROM node:23-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
# 构建镜像
docker build -t whelen .

# 运行容器
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=sk-xxx \
  -e DATABASE_URL=postgresql://... \
  whelen
```

---

## 🔧 部署后检查

### 1. 功能测试
- [ ] 首页加载正常
- [ ] 聊天功能正常
- [ ] Agent 响应正常
- [ ] K线数据正常
- [ ] 所有页面可访问

### 2. 性能测试
- [ ] 首页加载时间 < 2秒
- [ ] Agent 响应时间 < 10秒
- [ ] API 响应时间 < 5秒
- [ ] 并发测试（100用户）

### 3. 监控设置
- [ ] LangSmith 追踪正常
- [ ] 错误监控正常
- [ ] 性能监控正常
- [ ] 日志收集正常

---

## 📊 成本估算

### OpenAI API 成本
- **gpt-4o-mini**: $0.15/1M input tokens, $0.60/1M output tokens
- **gpt-4**: $5/1M input tokens, $15/1M output tokens

**估算（每天1000次对话）：**
- 使用 gpt-4o-mini: ~$5-10/天
- 使用 gpt-4: ~$50-100/天

### 基础设施成本
- **Vercel**: 免费（Hobby）或 $20/月（Pro）
- **PostgreSQL**: Supabase 免费或 $25/月
- **域名**: ~$10/年

**总计：** $30-150/月（取决于流量和模型选择）

---

## 🐛 常见问题

### Q: Agent 响应超时
**解决：**
1. 使用 gpt-4o-mini 替代 gpt-4
2. 减少选中的 Agent 数量
3. 增加 API 超时时间
4. 考虑自托管（无 Serverless 限制）

### Q: 数据库连接失败
**解决：**
1. 检查 DATABASE_URL 配置
2. 确认数据库可访问
3. 检查防火墙规则
4. 使用连接池

### Q: K线数据获取失败
**解决：**
1. 检查代理配置（国内需要）
2. 确认 API Key 有效
3. 检查网络连接
4. 使用备用数据源

---

## 📝 部署后维护

### 日常维护
- [ ] 监控 API 使用量
- [ ] 检查错误日志
- [ ] 更新依赖包
- [ ] 备份数据库

### 定期优化
- [ ] 分析 Agent 性能
- [ ] 优化 Prompt
- [ ] 更新知识库
- [ ] 添加新功能

### 用户反馈
- [ ] 收集用户反馈
- [ ] 分析使用数据
- [ ] 改进 Agent 回答
- [ ] 优化用户体验

---

## ✅ 最终检查清单

部署前确认：
- [ ] 所有环境变量已配置
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] 监控已配置
- [ ] 备份策略已制定

部署后确认：
- [ ] 所有功能正常
- [ ] 性能达标
- [ ] 监控正常
- [ ] 用户可访问

---

**🎉 准备就绪！可以开始部署了！**
