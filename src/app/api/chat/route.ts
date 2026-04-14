import { NextRequest, NextResponse } from "next/server";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AGENTS, llm } from "@/lib/agents/config";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let conversationLogId: string | null = null;
  
  try {
    const { message, agentId, userId } = await req.json();
    
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }
    
    console.log(`\n📨 收到问题: ${message}`);
    console.log(`🎯 指定 Agent: ${agentId || "auto"}`);
    
    // 如果指定了 Agent ID，直接使用该 Agent
    if (agentId) {
      const agent = AGENTS.find(a => a.id === agentId);
      
      if (!agent) {
        return NextResponse.json(
          { error: "Invalid agent ID" },
          { status: 400 }
        );
      }
      
      console.log(`🤖 使用 ${agent.name} Agent...`);
      
      try {
        const response = await llm.invoke([
          new SystemMessage(agent.systemPrompt),
          new HumanMessage(message),
        ]);
        
        const executionTime = Date.now() - startTime;
        const answer = response.content.toString();
        
        console.log(`✅ ${agent.name} 回复完成，耗时: ${executionTime}ms`);
        
        // 保存对话记录
        try {
          const log = await prisma.conversationLog.create({
            data: {
              userId: userId || null,
              agentId: agent.id,
              question: message,
              answer,
              agentsUsed: [agent.id],
              executionTime,
              status: 'success',
            },
          });
          conversationLogId = log.id;
        } catch (logError) {
          console.error('保存对话记录失败:', logError);
        }
        
        return NextResponse.json({
          success: true,
          data: {
            answer,
            agents: [agent.id],
            executionTime,
            timestamp: Date.now(),
            conversationLogId,
          },
        });
      } catch (error: any) {
        console.error(`❌ ${agent.name} 执行失败:`, error);
        
        // 保存失败记录
        try {
          await prisma.conversationLog.create({
            data: {
              userId: userId || null,
              agentId: agent.id,
              question: message,
              answer: null,
              agentsUsed: [agent.id],
              executionTime: Date.now() - startTime,
              status: 'error',
              errorMessage: error.message || '执行失败',
            },
          });
        } catch (logError) {
          console.error('保存错误记录失败:', logError);
        }
        
        throw error;
      }
    }
    
    // 如果没有指定 Agent，使用完整的 LangGraph 工作流
    const { askHelen } = await import("@/lib/agents/workflow");
    const result = await askHelen(message);
    
    console.log(`✅ 回复完成，调用了 ${result.agents.length} 个 Agent，耗时: ${result.executionTime}ms`);
    
    // 保存对话记录
    try {
      const log = await prisma.conversationLog.create({
        data: {
          userId: userId || null,
          agentId: result.agents[0] || 'router',
          question: message,
          answer: result.answer,
          agentsUsed: result.agents,
          executionTime: result.executionTime,
          status: 'success',
        },
      });
      conversationLogId = log.id;
    } catch (logError) {
      console.error('保存对话记录失败:', logError);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        answer: result.answer,
        agents: result.agents,
        executionTime: result.executionTime,
        timestamp: Date.now(),
        conversationLogId,
      },
    });
    
  } catch (error: any) {
    console.error("❌ API 错误:", error);
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "处理请求时出错",
      },
      { status: 500 }
    );
  }
}
