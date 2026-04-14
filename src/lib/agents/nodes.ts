import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AgentState, AgentResult, AGENTS, llm } from "./config";

// 路由节点：决定调用哪些 Agent
export async function routerNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("🔀 Router: 分析问题并选择 Agent...");
  
  const { question } = state;
  
  // 使用 LLM 进行智能路由
  const routerPrompt = `你是 Helen 的路由 Agent，负责分析用户问题并选择最合适的专业 Agent。

可用的 Agent：
${AGENTS.map(a => `- ${a.id}: ${a.name} - ${a.description}`).join("\n")}

用户问题：${question}

请分析这个问题，选择1-3个最相关的 Agent（返回 Agent ID，用逗号分隔）。
只返回 Agent ID，不要其他内容。例如：macro,commodity`;

  const response = await llm.invoke([
    new SystemMessage(routerPrompt),
    new HumanMessage(question),
  ]);
  
  const selectedAgents = response.content
    .toString()
    .split(",")
    .map(id => id.trim())
    .filter(id => AGENTS.some(a => a.id === id));
  
  console.log(`✅ Router: 选择了 ${selectedAgents.length} 个 Agent: ${selectedAgents.join(", ")}`);
  
  return {
    selectedAgents,
    metadata: {
      ...state.metadata,
      agentExecutionOrder: selectedAgents,
    },
  };
}

// 创建专业 Agent 节点的工厂函数
function createAgentNode(agentId: string) {
  return async (state: AgentState): Promise<Partial<AgentState>> => {
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) {
      console.error(`❌ Agent ${agentId} not found`);
      return {};
    }
    
    // 检查是否应该执行这个 Agent
    if (!state.selectedAgents.includes(agentId)) {
      console.log(`⏭️  ${agent.name}: 跳过（未被选中）`);
      return {};
    }
    
    console.log(`🤖 ${agent.name}: 开始分析...`);
    
    const { question } = state;
    
    try {
      const response = await llm.invoke([
        new SystemMessage(agent.systemPrompt),
        new HumanMessage(question),
      ]);
      
      const result: AgentResult = {
        agentId: agent.id,
        agentName: agent.name,
        content: response.content.toString(),
        confidence: 0.85, // 可以后续优化为动态计算
        timestamp: Date.now(),
      };
      
      console.log(`✅ ${agent.name}: 分析完成 (${result.content.length} 字符)`);
      
      return {
        agentResults: [...state.agentResults, result],
      };
    } catch (error) {
      console.error(`❌ ${agent.name}: 执行失败`, error);
      return {};
    }
  };
}

// 导出各个 Agent 节点
export const macroNode = createAgentNode("macro");
export const commodityNode = createAgentNode("commodity");
export const quantNode = createAgentNode("quant");
export const riskNode = createAgentNode("risk");
export const marketNode = createAgentNode("market");
export const portfolioNode = createAgentNode("portfolio");

// 综合节点：整合所有 Agent 的结果
export async function synthesizerNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("🔄 Synthesizer: 整合所有 Agent 结果...");
  
  const { question, agentResults } = state;
  
  if (agentResults.length === 0) {
    return {
      finalAnswer: "抱歉，暂时无法回答这个问题。请尝试换一个问题。",
    };
  }
  
  // 构建综合提示词
  const synthesizerPrompt = `你是 Helen 的综合分析 Agent，负责整合多个专业 Agent 的分析结果，给出最终建议。

用户问题：${question}

各专业 Agent 的分析：
${agentResults.map((r, i) => `
${i + 1}. ${r.agentName} 的分析：
${r.content}
`).join("\n")}

请综合以上分析，给出：
1. 核心观点（简明扼要）
2. 具体建议（可操作）
3. 风险提示（如有）

要求：
- 保持专业性和客观性
- 避免重复各 Agent 的内容
- 给出明确的结论和建议
- 如果各 Agent 观点有冲突，需要说明`;

  try {
    const response = await llm.invoke([
      new SystemMessage(synthesizerPrompt),
      new HumanMessage("请给出综合分析"),
    ]);
    
    const finalAnswer = response.content.toString();
    
    console.log(`✅ Synthesizer: 综合分析完成 (${finalAnswer.length} 字符)`);
    
    return {
      finalAnswer,
    };
  } catch (error) {
    console.error("❌ Synthesizer: 执行失败", error);
    return {
      finalAnswer: "综合分析时出现错误，请稍后重试。",
    };
  }
}
