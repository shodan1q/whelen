#!/bin/bash

echo "🧪 测试问海伦后台管理系统..."
echo ""

BASE_URL="http://localhost:3001"
COOKIE_FILE="/tmp/admin-test-cookies.txt"

# 清理旧的 cookie
rm -f $COOKIE_FILE

# 测试 1: 登录
echo "1️⃣  测试登录 API..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"helen2026"}' \
  -c $COOKIE_FILE)

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
  echo "✅ 登录成功"
  echo "   响应: $LOGIN_RESPONSE"
else
  echo "❌ 登录失败"
  echo "   响应: $LOGIN_RESPONSE"
  exit 1
fi

echo ""

# 测试 2: 获取统计数据
echo "2️⃣  测试统计 API..."
STATS_RESPONSE=$(curl -s "$BASE_URL/api/admin/stats" -b $COOKIE_FILE)

if echo "$STATS_RESPONSE" | grep -q "totalUsers"; then
  echo "✅ 统计 API 正常"
  echo "   响应: $STATS_RESPONSE"
else
  echo "❌ 统计 API 失败"
  echo "   响应: $STATS_RESPONSE"
fi

echo ""

# 测试 3: 访问后台首页（应该重定向或返回 HTML）
echo "3️⃣  测试后台首页访问..."
ADMIN_PAGE=$(curl -s -L "$BASE_URL/admin" -b $COOKIE_FILE -w "\nHTTP_CODE:%{http_code}")

if echo "$ADMIN_PAGE" | grep -q "HTTP_CODE:200"; then
  echo "✅ 后台首页访问成功"
else
  echo "⚠️  后台首页访问异常"
fi

echo ""

# 测试 4: 登出
echo "4️⃣  测试登出 API..."
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/logout" -b $COOKIE_FILE)

if echo "$LOGOUT_RESPONSE" | grep -q "success"; then
  echo "✅ 登出成功"
  echo "   响应: $LOGOUT_RESPONSE"
else
  echo "❌ 登出失败"
  echo "   响应: $LOGOUT_RESPONSE"
fi

echo ""

# 测试 5: 未认证访问（应该返回 401 或重定向）
echo "5️⃣  测试未认证访问..."
UNAUTH_RESPONSE=$(curl -s "$BASE_URL/api/admin/stats" -w "\nHTTP_CODE:%{http_code}")

if echo "$UNAUTH_RESPONSE" | grep -q "HTTP_CODE:401"; then
  echo "✅ 未认证访问被正确拦截"
else
  echo "⚠️  未认证访问处理异常"
  echo "   响应: $UNAUTH_RESPONSE"
fi

echo ""
echo "🎉 测试完成！"

# 清理
rm -f $COOKIE_FILE
