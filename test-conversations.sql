-- 测试对话管理模块的 SQL 脚本

-- 1. 插入测试数据
INSERT INTO "ConversationLog" (id, "userId", "agentId", question, answer, "agentsUsed", "executionTime", status, "createdAt")
VALUES
  ('test-1', 'user-1', 'market-analyst', '黄金价格最近走势如何？', '根据最新数据，黄金价格呈现上涨趋势...', ARRAY['market-analyst', 'data-fetcher'], 1500, 'success', NOW()),
  ('test-2', 'user-2', 'macro-analyst', '美联储加息对市场有什么影响？', '美联储加息通常会导致...', ARRAY['macro-analyst', 'market-analyst'], 2000, 'success', NOW()),
  ('test-3', 'user-1', 'market-analyst', '黄金价格最近走势如何？', '根据最新数据，黄金价格呈现上涨趋势...', ARRAY['market-analyst', 'data-fetcher'], 1600, 'success', NOW()),
  ('test-4', 'user-3', 'data-fetcher', '获取最新的市场数据', NULL, ARRAY['data-fetcher'], 500, 'error', NOW()),
  ('test-5', 'user-2', 'macro-analyst', '通货膨胀率是多少？', '当前通货膨胀率为...', ARRAY['macro-analyst'], 1200, 'success', NOW());

-- 2. 查询所有对话
SELECT id, question, "agentId", status, "executionTime", "createdAt"
FROM "ConversationLog"
ORDER BY "createdAt" DESC
LIMIT 10;

-- 3. 按关键词搜索
SELECT id, question, "agentId"
FROM "ConversationLog"
WHERE question ILIKE '%黄金%';

-- 4. 按 Agent 筛选
SELECT id, question, "agentsUsed"
FROM "ConversationLog"
WHERE 'market-analyst' = ANY("agentsUsed");

-- 5. Agent 统计
SELECT 
  "agentId",
  COUNT(*) as total_calls,
  COUNT(*) FILTER (WHERE status = 'success') as success_calls,
  COUNT(*) FILTER (WHERE status = 'error') as failed_calls,
  AVG("executionTime") as avg_execution_time,
  (COUNT(*) FILTER (WHERE status = 'success')::float / COUNT(*) * 100) as success_rate
FROM "ConversationLog"
GROUP BY "agentId"
ORDER BY total_calls DESC;

-- 6. 热门问题 Top 3
SELECT 
  question,
  COUNT(*) as count
FROM "ConversationLog"
GROUP BY question
ORDER BY count DESC
LIMIT 3;

-- 7. 清理测试数据
-- DELETE FROM "ConversationLog" WHERE id LIKE 'test-%';
