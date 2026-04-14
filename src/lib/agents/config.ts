import { ChatAnthropic } from "@langchain/anthropic";

// 配置 LLM（使用 Anthropic Claude）
export const llm = new ChatAnthropic({
  modelName: "claude-opus-4-6",
  anthropicApiKey: "sk-MRHzxg71EAhc5Fl303WQaSgLW15IbjBbG9wVHOfv0Fk5VASv",
  anthropicApiUrl: "https://hone.vvvv.ee/",
  temperature: 0.7,
  maxTokens: 2000,
});

// Agent 状态类型定义
export interface AgentState {
  question: string;
  selectedAgents: string[];
  agentResults: AgentResult[];
  finalAnswer: string | null;
  metadata: {
    startTime: number;
    agentExecutionOrder: string[];
  };
}

export interface AgentResult {
  agentId: string;
  agentName: string;
  content: string;
  confidence: number;
  sources?: string[];
  timestamp: number;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  keywords: string[];
  tools?: string[];
}

// 6个专业 Agent 配置
export const AGENTS: AgentConfig[] = [
  {
    id: "macro",
    name: "宏观分析",
    description: "全球宏观经济、政策分析",
    keywords: ["美联储", "利率", "GDP", "通胀", "央行", "货币政策", "财政政策", "经济周期"],
    systemPrompt: `你是 Helen 的宏观分析 Agent。
专长：全球宏观经济分析、货币政策解读、经济周期判断。
分析框架：
1. 宏观环境（利率、通胀、汇率）
2. 政策影响（央行、财政）
3. 市场传导（资金面、估值）
4. 投资建议（配置方向）

回答要求：
- 数据支撑（引用具体数据）
- 逻辑清晰（因果关系）
- 结论明确（投资建议）
- 风险提示（不确定性）`,
  },
  {
    id: "commodity",
    name: "大宗商品",
    description: "黄金、白银、原油等",
    keywords: ["黄金", "白银", "原油", "铜", "大宗商品", "贵金属", "能源", "工业金属"],
    systemPrompt: `你是 Helen 的大宗商品分析 Agent。
专长：黄金、白银、原油、工业金属分析。
分析框架：
1. 供需平衡（产量、库存、需求）
2. 宏观驱动（美元、利率、地缘）
3. 技术面（价格趋势、支撑阻力）
4. 配置建议（比例、时机）

回答要求：
- 当前价格和历史对比
- 供需基本面分析
- 宏观因素影响
- 配置比例建议`,
  },
  {
    id: "quant",
    name: "量化策略",
    description: "量化模型、技术分析",
    keywords: ["量化", "策略", "回测", "夏普比率", "最大回撤", "网格", "套利", "动量", "反转"],
    systemPrompt: `你是 Helen 的量化策略 Agent。
专长：量化模型、技术分析、策略回测。
分析框架：
1. 策略类型（趋势、均值回归、套利）
2. 历史表现（收益、回撤、夏普）
3. 适用场景（震荡、趋势、波动）
4. 风险控制（止损、仓位）

回答要求：
- 策略逻辑清晰
- 历史数据支撑
- 风险收益比
- 实施建议`,
  },
  {
    id: "risk",
    name: "风险管理",
    description: "风险评估、资产配置",
    keywords: ["风险", "VaR", "波动率", "Beta", "相关性", "对冲", "止损", "风险敞口"],
    systemPrompt: `你是 Helen 的风险管理 Agent。
专长：风险评估、组合分析、对冲策略。
分析框架：
1. 风险度量（VaR、波动率、Beta）
2. 风险来源（市场、信用、流动性）
3. 风险对冲（工具、成本）
4. 风险建议（调整方向）

回答要求：
- 量化风险指标
- 识别主要风险
- 对冲方案
- 风险预警`,
  },
  {
    id: "market",
    name: "市场研究",
    description: "行业研究、公司分析",
    keywords: ["行业", "公司", "估值", "竞争", "新能源", "科技", "消费", "医药", "研报"],
    systemPrompt: `你是 Helen 的市场研究 Agent。
专长：行业分析、公司研究、估值评估。
分析框架：
1. 行业现状（规模、增速、格局）
2. 竞争分析（龙头、壁垒、趋势）
3. 估值水平（PE、PB、PEG）
4. 投资建议（标的、时机）

回答要求：
- 行业数据详实
- 竞争格局清晰
- 估值合理性
- 标的推荐`,
  },
  {
    id: "portfolio",
    name: "组合优化",
    description: "资产配置、再平衡",
    keywords: ["配置", "组合", "再平衡", "分散", "相关性", "权重", "调仓"],
    systemPrompt: `你是 Helen 的组合优化 Agent。
专长：资产配置、组合优化、再平衡策略。
分析框架：
1. 当前组合（资产、权重、风险）
2. 优化目标（收益、风险、夏普）
3. 调整方案（加仓、减仓、新增）
4. 再平衡（时机、频率、成本）

回答要求：
- 当前组合分析
- 优化建议明确
- 预期收益风险
- 实施步骤`,
  },
];

// Agent 关键词匹配权重
export function calculateAgentRelevance(question: string, agent: AgentConfig): number {
  const lowerQuestion = question.toLowerCase();
  let score = 0;
  
  for (const keyword of agent.keywords) {
    if (lowerQuestion.includes(keyword.toLowerCase())) {
      score += 1;
    }
  }
  
  return score;
}

// 根据问题选择相关 Agent
export function selectRelevantAgents(question: string, maxAgents: number = 3): string[] {
  const scores = AGENTS.map(agent => ({
    id: agent.id,
    score: calculateAgentRelevance(question, agent),
  }));
  
  // 按分数排序
  scores.sort((a, b) => b.score - a.score);
  
  // 如果没有匹配，默认使用宏观分析
  if (scores[0].score === 0) {
    return ["macro"];
  }
  
  // 返回得分最高的 Agent（最多 maxAgents 个）
  return scores
    .filter(s => s.score > 0)
    .slice(0, maxAgents)
    .map(s => s.id);
}
