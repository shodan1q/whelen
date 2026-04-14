# 问海伦后台管理系统开发计划

## 项目信息
- 项目路径: /Users/shodan/project/whelen
- 后台路径: /Users/shodan/project/whelen/src/app/admin
- 数据库: postgresql://shodan@localhost:5432/whelen

## 后台功能模块

### 1. 用户管理模块
- 用户列表（查看、搜索、筛选）
- 用户详情（基本信息、订阅状态、使用记录）
- 用户权限管理
- 用户统计（新增、活跃、留存）

### 2. 内容管理模块
- 文章管理（黄金周刊）
  - 文章列表、新增、编辑、删除
  - 分类管理（黄金相关宏观、有色相关个股）
  - 发布/下架
- 图表管理（每日一图）
  - 图表上传、编辑、删除
  - 图表分类和标签
- 学习资源管理（盘后三点）
  - 资源上传、分类、管理

### 3. 数据管理模块
- K线数据源配置
- 市场数据刷新
- 数据缓存管理
- API配置（Binance、Yahoo Finance）

### 4. 对话管理模块
- 对话记录查看
- 热门问题统计
- Agent 使用统计
- 用户反馈管理

### 5. 系统设置模块
- 管理员账号管理
- 系统配置
- API Key 管理
- 日志查看

### 6. 数据统计模块
- 用户统计（DAU、MAU、新增）
- 功能使用统计
- Agent 调用统计
- 性能监控

## 技术方案

### 前端
- Next.js App Router
- 路由: /admin/*
- 组件库: Tailwind + Headless UI
- 图表: Recharts
- 表格: TanStack Table

### 后端
- API 路由: /api/admin/*
- 认证: JWT + Session
- 权限: RBAC（Role-Based Access Control）
- 数据库: Prisma + PostgreSQL

### 数据库表设计
```sql
-- 管理员表
CREATE TABLE admins (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户表（已存在，需扩展）
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP;

-- 文章表
CREATE TABLE articles (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  category VARCHAR(50),
  author VARCHAR(100),
  source_url TEXT,
  cover_image TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 对话记录表
CREATE TABLE conversations (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  agent_id VARCHAR(50),
  question TEXT NOT NULL,
  answer TEXT,
  agents_used TEXT[],
  execution_time INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 系统配置表
CREATE TABLE system_configs (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 任务分配

### Agent 1: 后台基础架构 + 认证系统
**负责人**: subagent-admin-auth
**任务**:
1. 创建后台布局组件（侧边栏、顶部导航、面包屑）
2. 实现管理员登录/登出功能
3. JWT 认证中间件
4. 权限检查中间件
5. 数据库表初始化（admins, system_configs）
6. 创建默认管理员账号

**交付物**:
- src/app/admin/layout.tsx
- src/app/admin/login/page.tsx
- src/middleware.ts
- src/lib/auth.ts
- src/lib/admin-db.ts

### Agent 2: 用户管理 + 数据统计
**负责人**: subagent-admin-users
**任务**:
1. 用户列表页面（搜索、筛选、分页）
2. 用户详情页面
3. 用户统计 Dashboard
4. 数据可视化图表（用户增长、活跃度）
5. 用户管理 API

**交付物**:
- src/app/admin/users/page.tsx
- src/app/admin/users/[id]/page.tsx
- src/app/admin/dashboard/page.tsx
- src/app/api/admin/users/route.ts
- src/app/api/admin/stats/route.ts

### Agent 3: 内容管理（文章 + 图表）
**负责人**: subagent-admin-content
**任务**:
1. 文章列表页面（CRUD）
2. 文章编辑器（Markdown 支持）
3. 图表管理页面
4. 文件上传功能
5. 内容管理 API

**交付物**:
- src/app/admin/articles/page.tsx
- src/app/admin/articles/[id]/page.tsx
- src/app/admin/charts/page.tsx
- src/app/api/admin/articles/route.ts
- src/app/api/admin/upload/route.ts

### Agent 4: 对话管理 + Agent 统计
**负责人**: subagent-admin-conversations
**任务**:
1. 对话记录列表页面
2. 对话详情查看
3. Agent 使用统计
4. 热门问题分析
5. 对话记录 API

**交付物**:
- src/app/admin/conversations/page.tsx
- src/app/admin/conversations/[id]/page.tsx
- src/app/admin/agents/page.tsx
- src/app/api/admin/conversations/route.ts
- src/app/api/admin/agents/stats/route.ts

## 开发顺序
1. Agent 1 先完成基础架构（其他 Agent 依赖）
2. Agent 2、3、4 并行开发
3. 集成测试
4. 文档编写

## 默认管理员账号
- 用户名: admin
- 密码: helen2026
- 邮箱: admin@whelen.local

## 时间估算
- Agent 1: 2-3 小时
- Agent 2: 2-3 小时
- Agent 3: 2-3 小时
- Agent 4: 2-3 小时
- 总计: 8-12 小时（并行开发约 3-4 小时）
