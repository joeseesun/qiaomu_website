import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { posts, categories, tags, post_categories, post_tags } from '@/lib/db/schema';
import { count, eq, desc, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // 检查用户是否已登录
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取文章总数
    const postsCount = await db
      .select({ count: count() })
      .from(posts)
      .execute();

    // 获取分类总数
    const categoriesCount = await db
      .select({ count: count() })
      .from(categories)
      .execute();

    // 获取标签总数
    const tagsCount = await db
      .select({ count: count() })
      .from(tags)
      .execute();

    // 获取总浏览量
    const viewsCount = await db
      .select({ total: sql<number>`sum(${posts.views})` })
      .from(posts)
      .execute();

    // 获取最近的5篇文章
    const recentPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        publishDate: posts.publishDate,
        views: posts.views,
      })
      .from(posts)
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.publishDate))
      .limit(5)
      .execute();

    return NextResponse.json({
      posts: postsCount[0]?.count || 0,
      categories: categoriesCount[0]?.count || 0,
      tags: tagsCount[0]?.count || 0,
      views: viewsCount[0]?.total || 0,
      recentPosts,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
