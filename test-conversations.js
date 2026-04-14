#!/usr/bin/env node

/**
 * 对话管理模块测试脚本
 * 
 * 测试内容：
 * 1. 创建测试对话记录
 * 2. 查询对话记录
 * 3. 获取 Agent 统计
 * 4. 获取热门问题
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  console.log('📝 创建测试对话记录...\n');

  const testConversations = [
    {
      userId: 'test-user-1',
      agentId: 'market-analyst',
      question: '黄金价格最近走势如何？',
      answer: '根据最新数据，黄金价格呈现上涨趋势...',
      agentsUsed: ['market-analyst', 'data-fetcher'],
      executionTime: 1500,
      status: 'success',
    },
    {
      userId: 'test-user-2',
      agentId: 'macro-analyst',
      question: '美联储加息对市场有什么影响？',
      answer: '美联储加息通常会导致...',
      agentsUsed: ['macro-analyst', 'market-analyst'],
      executionTime: 2000,
      status: 'success',
    },
    {
      userId: 'test-user-1',
      agentId: 'market-analyst',
      question: '黄金价格最近走势如何？',
      answer: '根据最新数据，黄金价格呈现上涨趋势...',
      agentsUsed: ['market-analyst', 'data-fetcher'],
      executionTime: 1600,
      status: 'success',
    },
    {
      userId: 'test-user-3',
      agentId: 'data-fetcher',
      question: '获取最新的市场数据',
      answer: null,
      agentsUsed: ['data-fetcher'],
      executionTime: 500,
      status: 'error',
      errorMessage: '数据源连接失败',
    },
    {
      userId: 'test-user-2',
      agentId: 'macro-analyst',
      question: '通货膨胀率是多少？',
      answer: '当前通货膨胀率为...',
      agentsUsed: ['macro-analyst'],
      executionTime: 1200,
      status: 'success',
    },
  ];

  for (const conv of testConversations) {
    const created = await prisma.conversationLog.create({
      data: conv,
    });
    console.log(`✅ 创建对话记录: ${created.id}`);
  }

  console.log(`\n✨ 成功创建 ${testConversations.length} 条测试记录\n`);
}

async function testQueries() {
  console.log('🔍 测试查询功能...\n');

  // 1. 查询所有对话
  const allConversations = await prisma.conversationLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.log(`📊 最近 5 条对话记录:`);
  allConversations.forEach(c => {
    console.log(`  - ${c.question.substring(0, 30)}... (${c.status})`);
  });

  // 2. 按关键词搜索
  console.log('\n🔎 搜索包含"黄金"的对话:');
  const searchResults = await prisma.conversationLog.findMany({
    where: {
      question: {
        contains: '黄金',
        mode: 'insensitive',
      },
    },
  });
  console.log(`  找到 ${searchResults.length} 条记录`);

  // 3. 按 Agent 筛选
  console.log('\n🤖 market-analyst Agent 的对话:');
  const agentConversations = await prisma.conversationLog.findMany({
    where: {
      agentsUsed: {
        has: 'market-analyst',
      },
    },
  });
  console.log(`  找到 ${agentConversations.length} 条记录`);

  // 4. 统计 Agent 使用情况
  console.log('\n📈 Agent 统计:');
  const conversations = await prisma.conversationLog.findMany({
    select: {
      agentId: true,
      agentsUsed: true,
      executionTime: true,
      status: true,
    },
  });

  const agentMap = new Map();
  conversations.forEach(conv => {
    const agents = Array.from(new Set([conv.agentId, ...conv.agentsUsed]));
    agents.forEach(agentId => {
      if (!agentMap.has(agentId)) {
        agentMap.set(agentId, {
          totalCalls: 0,
          successCalls: 0,
          failedCalls: 0,
          totalTime: 0,
          count: 0,
        });
      }
      const stats = agentMap.get(agentId);
      stats.totalCalls++;
      if (conv.status === 'success') stats.successCalls++;
      else stats.failedCalls++;
      if (conv.executionTime) {
        stats.totalTime += conv.executionTime;
        stats.count++;
      }
    });
  });

  agentMap.forEach((stats, agentId) => {
    const avgTime = stats.count > 0 ? (stats.totalTime / stats.count).toFixed(0) : 0;
    const successRate = ((stats.successCalls / stats.totalCalls) * 100).toFixed(1);
    console.log(`  ${agentId}:`);
    console.log(`    调用次数: ${stats.totalCalls}`);
    console.log(`    成功率: ${successRate}%`);
    console.log(`    平均响应时间: ${avgTime}ms`);
  });

  // 5. 热门问题
  console.log('\n🔥 热门问题 Top 3:');
  const popularQuestions = await prisma.conversationLog.groupBy({
    by: ['question'],
    _count: {
      question: true,
    },
    orderBy: {
      _count: {
        question: 'desc',
      },
    },
    take: 3,
  });

  popularQuestions.forEach((q, index) => {
    console.log(`  ${index + 1}. ${q.question.substring(0, 40)}... (${q._count.question} 次)`);
  });
}

async function cleanup() {
  console.log('\n🧹 清理测试数据...');
  const deleted = await prisma.conversationLog.deleteMany({
    where: {
      userId: {
        startsWith: 'test-user',
      },
    },
  });
  console.log(`✅ 删除了 ${deleted.count} 条测试记录\n`);
}

async function main() {
  console.log('🚀 开始测试对话管理模块\n');
  console.log('='.repeat(50) + '\n');

  try {
    await createTestData();
    await testQueries();
    
    console.log('\n' + '='.repeat(50));
    console.log('\n✨ 所有测试通过！\n');
    
    // 询问是否清理
    console.log('💡 提示: 测试数据已创建，可以在后台查看');
    console.log('   如需清理测试数据，请运行: node test-conversations.js --cleanup\n');
    
    if (process.argv.includes('--cleanup')) {
      await cleanup();
    }
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
