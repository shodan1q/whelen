import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { AgentResult } from "./config";
import {
  routerNode,
  macroNode,
  commodityNode,
  quantNode,
  riskNode,
  marketNode,
  portfolioNode,
  synthesizerNode,
} from "./nodes";

// 定义状态结构（支持并发更新）
const AgentStateAnnotation = Annotation.Root({
  question: Annotation<string>(),
  selectedAgents: Annotation<string[]>(),
  agentResults: Annotation<AgentResult[]>({
    reducer: (current, update) => [...current, ...update],
    default: () => [],
  }),
  finalAnswer: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  metadata: Annotation<{
    startTime: number;
    agentExecutionOrder: string[];
  }>(),
});

// 创建 Helen 的多 Agent 工作流
export function createHelenWorkflow() {
  const workflow = new StateGraph(AgentStateAnnotation);

  // 添加节点
  workflow.addNode("router", routerNode);
  workflow.addNode("macro", macroNode);
  workflow.addNode("commodity", commodityNode);
  workflow.addNode("quant", quantNode);
  workflow.addNode("risk", riskNode);
  workflow.addNode("market", marketNode);
  workflow.addNode("portfolio", portfolioNode);
  workflow.addNode("synthesizer", synthesizerNode);

  // 设置入口点
  workflow.addEdge("__start__" as any, "router" as any);

  // Router 到各个专业 Agent（并行执行）
  workflow.addEdge("router" as any, "macro" as any);
  workflow.addEdge("router" as any, "commodity" as any);
  workflow.addEdge("router" as any, "quant" as any);
  workflow.addEdge("router" as any, "risk" as any);
  workflow.addEdge("router" as any, "market" as any);
  workflow.addEdge("router" as any, "portfolio" as any);

  // 各个 Agent 到 Synthesizer
  workflow.addEdge("macro" as any, "synthesizer" as any);
  workflow.addEdge("commodity" as any, "synthesizer" as any);
  workflow.addEdge("quant" as any, "synthesizer" as any);
  workflow.addEdge("risk" as any, "synthesizer" as any);
  workflow.addEdge("market" as any, "synthesizer" as any);
  workflow.addEdge("portfolio" as any, "synthesizer" as any);

  // Synthesizer 到结束
  workflow.addEdge("synthesizer" as any, END);

  return workflow.compile();
}

// 执行工作流的便捷函数
export async function askHelen(question: string): Promise<{
  answer: string;
  agents: string[];
  results: any[];
  executionTime: number;
}> {
  const startTime = Date.now();
  
  console.log("\n" + "=".repeat(60));
  console.log(`📝 用户问题: ${question}`);
  console.log("=".repeat(60) + "\n");
  
  const workflow = createHelenWorkflow();
  
  const initialState = {
    question,
    selectedAgents: [],
    agentResults: [],
    finalAnswer: null,
    metadata: {
      startTime,
      agentExecutionOrder: [],
    },
  };
  
  try {
    const result = await workflow.invoke(initialState);
    
    const executionTime = Date.now() - startTime;
    
    console.log("\n" + "=".repeat(60));
    console.log(`✅ 执行完成，耗时: ${executionTime}ms`);
    console.log(`📊 调用了 ${result.selectedAgents.length} 个 Agent: ${result.selectedAgents.join(", ")}`);
    console.log("=".repeat(60) + "\n");
    
    return {
      answer: result.finalAnswer || "无法生成回答",
      agents: result.selectedAgents,
      results: result.agentResults,
      executionTime,
    };
  } catch (error) {
    console.error("❌ 工作流执行失败:", error);
    throw error;
  }
}
