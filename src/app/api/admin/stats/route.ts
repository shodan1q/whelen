import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // TODO: 等待 admin-auth 完成后添加认证检查
    // const admin = await getCurrentAdmin();
    // if (!admin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 总用户数
    const totalUsers = await prisma.user.count();

    // 总文章数
    const totalArticles = await prisma.article.count();

    // 总对话数
    const totalConversations = await prisma.conversationLog.count();

    // 总图表数（从 localStorage 或其他地方获取，这里暂时返回 0）
    const totalCharts = 0;

    return NextResponse.json({
      totalUsers,
      totalArticles,
      totalConversations,
      totalCharts,
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
