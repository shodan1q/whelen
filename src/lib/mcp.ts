// MCP (Model Context Protocol) 接口预留
// 用于 OpenClaw 集成，Helen AI 通过 MCP 调用外部工具

export interface MCPToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface MCPToolResult {
  content: string;
  isError?: boolean;
}

export interface MCPContext {
  conversationId: string;
  userId: string;
  tools: MCPTool[];
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

// 预定义的 Helen MCP 工具
export const HELEN_MCP_TOOLS: MCPTool[] = [
  {
    name: "get_market_data",
    description: "获取实时市场数据（指数、商品、外汇、加密货币）",
    parameters: {
      type: "object",
      properties: {
        symbol: { type: "string", description: "市场代码，如 SPX, BTCUSD, XAUUSD" },
        timeframe: { type: "string", enum: ["1d", "1w", "1m", "3m", "1y"] },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_macro_indicators",
    description: "获取宏观经济指标（GDP、CPI、PMI、利率等）",
    parameters: {
      type: "object",
      properties: {
        indicator: { type: "string", description: "指标名称" },
        country: { type: "string", description: "国家代码，如 US, CN, EU" },
      },
      required: ["indicator"],
    },
  },
  {
    name: "analyze_portfolio",
    description: "分析投资组合风险和收益",
    parameters: {
      type: "object",
      properties: {
        holdings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              symbol: { type: "string" },
              weight: { type: "number" },
            },
          },
        },
      },
      required: ["holdings"],
    },
  },
  {
    name: "search_reports",
    description: "搜索 Helen 的宏观分析报告",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
        category: { type: "string", enum: ["macro", "quant", "index", "market"] },
      },
      required: ["query"],
    },
  },
  {
    name: "get_index_recommendation",
    description: "获取指数投资建议",
    parameters: {
      type: "object",
      properties: {
        riskLevel: { type: "string", enum: ["conservative", "moderate", "aggressive"] },
        horizon: { type: "string", enum: ["short", "medium", "long"] },
      },
      required: ["riskLevel"],
    },
  },
];

// MCP 请求处理器（预留接口，后续接入 OpenClaw）
export async function handleMCPRequest(
  toolCall: MCPToolCall,
  context: MCPContext
): Promise<MCPToolResult> {
  // TODO: 接入 OpenClaw MCP server
  // 当前返回模拟数据
  switch (toolCall.name) {
    case "get_market_data":
      return {
        content: JSON.stringify({
          symbol: toolCall.arguments.symbol,
          price: 0,
          change: 0,
          message: "MCP 接口待接入实时数据源",
        }),
      };
    default:
      return {
        content: `工具 ${toolCall.name} 尚未实现`,
        isError: true,
      };
  }
}
