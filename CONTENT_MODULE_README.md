# 问海伦后台管理系统 - 内容管理模块

## 已完成功能

### 1. 文章管理
- **文章列表** (`/admin/articles`)
  - 显示所有文章（标题、分类、状态、发布时间）
  - 筛选功能（按分类、状态）
  - 编辑和删除操作

- **新建文章** (`/admin/articles/new`)
  - 标题、内容（Markdown）、分类、作者、来源链接
  - 封面图上传
  - 状态选择（草稿/已发布）

- **编辑文章** (`/admin/articles/[id]`)
  - 加载现有文章数据
  - 修改所有字段
  - 保存更改

### 2. 图表管理
- **图表管理页面** (`/admin/charts`)
  - 上传图片（拖拽或点击）
  - 图表预览（网格布局）
  - 删除图表
  - 本地存储（localStorage）

### 3. 文件上传
- **上传组件** (`FileUpload`)
  - 支持拖拽上传
  - 图片预览
  - 文件大小限制（默认 5MB）
  - 自动生成唯一文件名

- **上传 API** (`/api/admin/upload`)
  - 接收文件并保存到 `public/uploads/`
  - 返回文件 URL

### 4. Markdown 编辑器
- **编辑器组件** (`MarkdownEditor`)
  - 基于 SimpleMDE/EasyMDE
  - 实时预览
  - 工具栏（加粗、斜体、标题、列表、链接、图片等）
  - 全屏模式
  - 字数统计

### 5. 内容管理 API
- **文章 CRUD** (`/api/admin/articles`)
  - `GET` - 获取文章列表（支持筛选）
  - `POST` - 创建新文章
  - `PUT` - 更新文章
  - `DELETE` - 删除文章

## 数据库表

```prisma
model Article {
  id          String    @id @default(cuid())
  title       String
  content     String    @db.Text
  category    String?
  author      String?
  sourceUrl   String?
  coverImage  String?
  status      String    @default("draft")
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## 技术栈

- **Next.js 16** - App Router
- **Tailwind CSS** - 样式
- **Prisma 7** - ORM（PostgreSQL）
- **SimpleMDE** - Markdown 编辑器
- **React Markdown** - Markdown 渲染
- **Heroicons** - 图标

## 文件结构

```
src/
├── app/
│   ├── admin/
│   │   ├── articles/
│   │   │   ├── page.tsx          # 文章列表
│   │   │   ├── new/page.tsx      # 新建文章
│   │   │   └── [id]/page.tsx     # 编辑文章
│   │   └── charts/
│   │       └── page.tsx          # 图表管理
│   └── api/
│       └── admin/
│           ├── articles/route.ts # 文章 API
│           └── upload/route.ts   # 上传 API
├── components/
│   └── admin/
│       ├── MarkdownEditor.tsx    # Markdown 编辑器
│       └── FileUpload.tsx        # 文件上传组件
└── lib/
    └── prisma.ts                 # Prisma 客户端

prisma/
└── schema.prisma                 # 数据库 Schema

public/
└── uploads/                      # 上传文件目录
```

## 使用说明

### 1. 访问文章管理
```
http://localhost:3000/admin/articles
```

### 2. 创建新文章
1. 点击"新建文章"按钮
2. 填写标题、选择分类
3. 使用 Markdown 编辑器编写内容
4. 可选：上传封面图、填写作者和来源
5. 选择状态（草稿/已发布）
6. 点击"保存文章"

### 3. 编辑文章
1. 在文章列表中点击编辑图标
2. 修改内容
3. 点击"保存更改"

### 4. 管理图表
```
http://localhost:3000/admin/charts
```
1. 拖拽或点击上传图片
2. 查看已上传的图表
3. 点击删除按钮移除图表

## 注意事项

1. **权限验证**：API 需要添加管理员权限验证（待 admin-auth 模块完成）
2. **文件存储**：当前文件存储在 `public/uploads/`，生产环境建议使用 CDN
3. **图表存储**：当前使用 localStorage，建议改为数据库存储
4. **Markdown 编辑器**：使用 `dynamic import` 避免 SSR 问题

## 下一步

- [ ] 集成管理员权限验证
- [ ] 图表数据库存储
- [ ] 文件上传到 CDN
- [ ] 文章搜索功能
- [ ] 批量操作
- [ ] 文章标签系统
