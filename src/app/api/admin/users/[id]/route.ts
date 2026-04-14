import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: 等待 admin-auth 完成后添加认证检查
    // const session = await getAdminSession(request);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id } = await params;

    // 获取用户详情
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          orderBy: { startDate: 'desc' },
          take: 10,
        },
        conversations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        bookmarks: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            report: {
              select: {
                id: true,
                title: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 统计数据
    const stats = {
      totalConversations: await prisma.conversation.count({
        where: { userId: id },
      }),
      totalMessages: await prisma.message.count({
        where: {
          conversation: {
            userId: id,
          },
        },
      }),
      totalBookmarks: await prisma.bookmark.count({
        where: { userId: id },
      }),
    };

    return NextResponse.json({
      user,
      stats,
    });
  } catch (error) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json(
      { error: '获取用户详情失败' },
      { status: 500 }
    );
  }
}
