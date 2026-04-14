import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
  }
}

// POST - 创建文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, author, sourceUrl, coverImage, status } = body;

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        category,
        author,
        sourceUrl,
        coverImage,
        status: status || 'draft',
        publishedAt: status === 'published' ? new Date() : null,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json({ error: '创建文章失败' }, { status: 500 });
  }
}

// PUT - 更新文章
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, category, author, sourceUrl, coverImage, status } = body;

    if (!id) {
      return NextResponse.json({ error: '文章 ID 不能为空' }, { status: 400 });
    }

    const updateData: any = {
      title,
      content,
      category,
      author,
      sourceUrl,
      coverImage,
      status,
    };

    // 如果状态改为已发布且之前没有发布时间，设置发布时间
    if (status === 'published') {
      const existing = await prisma.article.findUnique({ where: { id } });
      if (existing && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json({ error: '更新文章失败' }, { status: 500 });
  }
}

// DELETE - 删除文章
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '文章 ID 不能为空' }, { status: 400 });
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 });
  }
}
