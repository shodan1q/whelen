import { NextRequest, NextResponse } from "next/server";
import { HELEN_MCP_TOOLS, handleMCPRequest } from "@/lib/mcp";
import type { MCPToolCall, MCPContext } from "@/lib/mcp";

// MCP 工具列表
export async function GET() {
  return NextResponse.json({
    tools: HELEN_MCP_TOOLS,
    version: "1.0.0",
    name: "helen-mcp",
    description: "Helen AI 分身 MCP Server",
  });
}

// MCP 工具调用
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolCall, context } = body as {
      toolCall: MCPToolCall;
      context: MCPContext;
    };

    if (!toolCall?.name) {
      return NextResponse.json({ error: "Missing toolCall.name" }, { status: 400 });
    }

    const result = await handleMCPRequest(toolCall, context);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { content: "MCP 请求处理失败", isError: true },
      { status: 500 }
    );
  }
}
