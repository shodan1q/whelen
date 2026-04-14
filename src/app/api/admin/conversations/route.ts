import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/conversations - 获取对话记录列表
export async function GET(request: NextRequest) {
  try {
    // TODO: 验证管理员权限
    // const session = await getSession(request);
    // if (!session || session.role !== 'ADMIN') {
    //   return NextResponse.json({ error: '无权限' }, { status: 403 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const agentId = searchParams.get('agentId');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.question = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (agentId) {
      where.agentsUsed = {
        has: agentId,
      };
    }

    const [conversations, totalCount] = await Promise.all([
      prisma.conversationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.conversationLog.count({ where }),
    ]);

    return NextResponse.json({
      conversations: conversations.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
      totalCount,
      page,
      limit,
    });
  } catch (error) {
    console.error('获取对话记录失败:', error);
    return NextResponse.json(
      { error: '获取对话记录失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/conversations - 创建对话记录（由前台 chat API 调用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      agentId,
      question,
      answer,
      agentsUsed,
      executionTime,
      status = 'success',
      errorMessage,
    } = body;

    if (!agentId || !question) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversationLog.create({
      data: {
        userId,
        agentId,
        question,
        answer,
        agentsUsed: agentsUsed || [],
        executionTime,
        status,
        errorMessage,
      },
    });

    return NextResponse.json({
      id: conversation.id,
      createdAt: conversation.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('创建对话记录失败:', error);
    return NextResponse.json(
      { error: '创建对话记录失败' },
      { status: 500 }
    );
  }
}
