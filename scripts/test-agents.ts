#!/usr/bin/env tsx
/**
 * Helen Agent 工作流测试脚本
 * 
 * 使用方法：
 * 1. 配置 .env 中的 OPENAI_API_KEY
 * 2. 运行: pnpm tsx scripts/test-agents.ts
 */

import { config } from "dotenv";
import { askHelen } from "../src/lib/agents/workflow";

// 加载环境变量
config();

async function main() {
  console.log("🚀 Helen Agent 工作流测试\n");
  
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ 错误: 请在 .env 文件中配置 OPENAI_API_KEY");
    process.exit(1);
  }
  
  // 测试问题列表
  const testQuestions = [
    "最近美联储的利率政策对A股有什么影响？",
    "黄金现在还能配置吗？",
    "有什么量化策略可以在震荡市中获利？",
    "如何评估当前组合的风险敞口？",
    "新能源行业现在还值得投资吗？",
    "我的组合需要再平衡吗？",
  ];
  
  // 选择一个问题测试（可以修改索引）
  const questionIndex = 0;
  const question = testQuestions[questionIndex];
  
  console.log(`📝 测试问题 ${questionIndex + 1}/${testQuestions.length}:`);
  console.log(`   "${question}"\n`);
  
  try {
    const result = await askHelen(question);
    
    console.log("\n" + "=".repeat(80));
    console.log("📊 执行结果");
    console.log("=".repeat(80));
    console.log(`\n调用的 Agent: ${result.agents.join(", ")}`);
    console.log(`执行时间: ${(result.executionTime / 1000).toFixed(2)}s`);
    console.log(`\n最终回答:\n${result.answer}\n`);
    console.log("=".repeat(80) + "\n");
    
    // 显示各个 Agent 的详细结果
    if (result.results.length > 0) {
      console.log("📋 各 Agent 详细分析:\n");
      result.results.forEach((r, i) => {
        console.log(`${i + 1}. ${r.agentName}:`);
        console.log(`   ${r.content.substring(0, 200)}...`);
        console.log(`   (置信度: ${(r.confidence * 100).toFixed(0)}%)\n`);
      });
    }
    
  } catch (error) {
    console.error("\n❌ 测试失败:", error);
    process.exit(1);
  }
}

main();
