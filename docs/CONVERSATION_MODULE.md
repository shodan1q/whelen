# 对话管理模块

问海伦后台管理系统的对话管理模块，用于记录、查看和分析用户与 Helen AI 的对话。

## 功能特性

### 1. 对话记录列表
- 查看所有对话记录
- 按问题关键词搜索
- 按 Agent 筛选
- 分页浏览
- 显示执行时长和状态

**路由**: `/admin/conversations`

### 2. 对话详情
- 查看完整的问答内容
- 显示使用的所有 Agents
- 显示执行时间和状态
- 查看错误信息（如果失败）

**路由**: `/admin/conversations/[id]`

### 3. Agent 统计
- 各 Agent 调用次数统计
- 成功率分析
- 平均响应时间
- 可视化图表展示
- 热门问题 Top 10

**路由**: `/admin/agents`

## 数据库表结构

```prisma
model ConversationLog {
  id            String   @id @default(cuid())
  userId        String?
  agentId       String
  question      String   @db.Text
  answer        String?  @db.Text
  agentsUsed    String[]
  executionTime Int?
  status        String   @default("success") // success, error
  errorMessage  String?  @db.Text
  createdAt     DateTime @default(now())

  @@index([agentId, createdAt])
  @@index([userId, createdAt])
  @@index([createdAt])
}
```

## API 接口

### 1. 获取对话记录列表
```
GET /api/admin/conversations?page=1&limit=20&search=黄金&agentId=market-analyst
```

**参数**:
- `page`: 页码（默认 1）
- `limit`: 每页数量（默认 20）
- `search`: 搜索关键词（可选）
- `agentId`: Agent ID 筛选（可选）

**响应**:
```json
{
  "conversations": [...],
  "totalCount": 100,
  "page": 1,
  "limit": 20
}
```

### 2. 创建对话记录
```
POST /api/admin/conversations
```

**请求体**:
```json
{
  "userId": "user-123",
  "agentId": "market-analyst",
  "question": "黄金价格走势如何？",
  "answer": "根据最新数据...",
  "agentsUsed": ["market-analyst", "data-fetcher"],
  "executionTime": 1500,
  "status": "success"
}
```

### 3. 获取 Agent 统计
```
GET /api/admin/agents/stats?startDate=2024-01-01&endDate=2024-12-31
```

**参数**:
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）

**响应**:
```json
{
  "stats": [
    {
      "agentId": "market-analyst",
      "totalCalls": 150,
      "successCalls": 145,
      "failedCalls": 5,
      "avgExecutionTime": 1500,
      "successRate": 96.67
    }
  ],
  "popularQuestions": [
    {
      "question": "黄金价格走势如何？",
      "count": 25
    }
  ],
  "totalConversations": 500
}
```

## 前台集成

对话记录会在 `/api/chat` 接口中自动保存。前台调用时可以传入 `userId` 参数：

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '黄金价格走势如何？',
    agentId: 'market-analyst', // 可选
    userId: 'user-123', // 可选
  }),
});
```

响应会包含 `conversationLogId`：

```json
{
  "success": true,
  "data": {
    "answer": "...",
    "agents": ["market-analyst"],
    "executionTime": 1500,
    "conversationLogId": "clxxx..."
  }
}
```

## 测试

运行测试脚本创建测试数据：

```bash
node test-conversations.js
```

清理测试数据：

```bash
node test-conversations.js --cleanup
```

## 组件

### ConversationList
对话列表组件，支持搜索、筛选和分页。

**使用**:
```tsx
import ConversationList from '@/components/admin/ConversationList';

<ConversationList 
  initialData={conversations} 
  totalCount={totalCount} 
/>
```

### AgentStatsChart
Agent 统计图表组件，使用 Recharts 展示数据。

**使用**:
```tsx
import AgentStatsChart from '@/components/admin/AgentStatsChart';

<AgentStatsChart stats={stats} />
```

## 权限控制

⚠️ **注意**: 当前 API 接口的权限验证已预留但未实现。需要等待 `admin-auth` 模块完成后，取消注释以下代码：

```typescript
// TODO: 验证管理员权限
// const session = await getSession(request);
// if (!session || session.role !== 'ADMIN') {
//   return NextResponse.json({ error: '无权限' }, { status: 403 });
// }
```

## 文件清单

### 页面
- `src/app/admin/conversations/page.tsx` - 对话记录列表
- `src/app/admin/conversations/[id]/page.tsx` - 对话详情
- `src/app/admin/agents/page.tsx` - Agent 统计

### API
- `src/app/api/admin/conversations/route.ts` - 对话记录 API
- `src/app/api/admin/agents/stats/route.ts` - Agent 统计 API
- `src/app/api/chat/route.ts` - 前台聊天 API（已修改）

### 组件
- `src/components/admin/ConversationList.tsx` - 对话列表组件
- `src/components/admin/AgentStatsChart.tsx` - Agent 统计图表

### 数据库
- `prisma/schema.prisma` - 数据库 Schema（已添加 ConversationLog 表）
- `prisma/migrations/xxx_add_conversation_log/` - 数据库迁移文件

### 测试
- `test-conversations.js` - 测试脚本

## 下一步

1. 等待 `admin-auth` 模块完成
2. 添加权限验证
3. 集成到后台布局
4. 添加更多筛选条件（日期范围、状态等）
5. 导出功能（CSV/Excel）
6. 实时统计更新

## 技术栈

- Next.js 16 App Router
- Prisma + PostgreSQL
- Tailwind CSS
- Recharts（图表库）
- TypeScript
