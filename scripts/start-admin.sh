#!/bin/bash

echo "🚀 启动问海伦后台管理系统..."

# 检查数据库连接
echo "📊 检查数据库连接..."
if ! psql -d whelen -c "SELECT 1" > /dev/null 2>&1; then
  echo "❌ 数据库连接失败，请确保 PostgreSQL 正在运行"
  exit 1
fi

# 检查管理员账号
echo "👤 检查管理员账号..."
ADMIN_EXISTS=$(psql -d whelen -t -c "SELECT COUNT(*) FROM \"Admin\" WHERE username='admin';" 2>/dev/null | tr -d ' ')

if [ "$ADMIN_EXISTS" = "0" ]; then
  echo "⚠️  管理员账号不存在，正在创建..."
  HASHED_PASSWORD='$2b$10$80oaTYv1OsFr3Kkwak3pReJdOUXNgGRuk0PoCSGAEnlealdFOkGpa'
  psql -d whelen -c "INSERT INTO \"Admin\" (id, username, password, email, role, \"createdAt\", \"updatedAt\") VALUES ('admin-001', 'admin', '$HASHED_PASSWORD', 'admin@whelen.local', 'super_admin', NOW(), NOW());"
  echo "✅ 管理员账号创建成功"
  echo "   用户名: admin"
  echo "   密码: helen2026"
else
  echo "✅ 管理员账号已存在"
fi

# 启动开发服务器
echo ""
echo "🌐 启动开发服务器..."
echo "   后台登录: http://localhost:3001/admin/login"
echo "   后台首页: http://localhost:3001/admin"
echo ""

npm run dev
