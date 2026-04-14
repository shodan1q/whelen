# 问海伦后台管理系统 - 快速开始

## 🚀 快速启动

### 1. 启动服务器
```bash
cd /Users/shodan/project/whelen
./scripts/start-admin.sh
```

### 2. 访问后台
打开浏览器访问: http://localhost:3001/admin/login

### 3. 登录
- 用户名: `admin`
- 密码: `helen2026`

## 📚 文档

- [实现文档](./ADMIN_IMPLEMENTATION.md) - 详细的实现说明
- [完成报告](./ADMIN_COMPLETION_REPORT.md) - 完整的开发报告
- [验收清单](./ADMIN_CHECKLIST.md) - 功能验收清单

## 🧪 测试

运行自动化测试：
```bash
./scripts/test-admin.sh
```

## 📁 项目结构

```
src/
├── lib/
│   ├── auth.ts              # JWT 认证
│   ├── admin-db.ts          # 管理员数据库操作
│   └── prisma.ts            # Prisma Client
├── middleware.ts            # 认证中间件
├── app/
│   ├── admin/
│   │   ├── layout.tsx       # 后台布局
│   │   ├── login/page.tsx   # 登录页面
│   │   └── page.tsx         # 后台首页
│   └── api/admin/
│       ├── login/route.ts   # 登录 API
│       ├── logout/route.ts  # 登出 API
│       └── stats/route.ts   # 统计 API
```

## 🔧 常用命令

### 数据库
```bash
# 查看管理员账号
psql -d whelen -c "SELECT * FROM \"Admin\";"

# 重置管理员密码
psql -d whelen -c "UPDATE \"Admin\" SET password='$2b$10$80oaTYv1OsFr3Kkwak3pReJdOUXNgGRuk0PoCSGAEnlealdFOkGpa' WHERE username='admin';"
```

### 开发
```bash
# 启动开发服务器
npm run dev

# 数据库迁移
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate
```

## 🎨 设计规范

### 颜色
- 主背景: `#0a0a0a`
- 卡片背景: `#111111`
- 边框: `#1a1a1a`
- 金色: `#d4af37` → `#f4d03f`

### 组件
- 按钮: 金色渐变 + 圆角
- 输入框: 深色背景 + 金色边框（focus）
- 卡片: 深色背景 + 细边框

## 🔒 安全

- JWT 认证（7 天有效期）
- httpOnly Cookie
- bcrypt 密码加密（10 轮）
- 路由保护中间件

## 📞 支持

如有问题，请查看：
1. [实现文档](./ADMIN_IMPLEMENTATION.md) - 常见问题
2. [完成报告](./ADMIN_COMPLETION_REPORT.md) - 已知问题
3. 服务器日志 - 查看错误信息

---

**开发者**: subagent-admin-auth  
**项目**: 问海伦后台管理系统  
**版本**: v1.0.0
