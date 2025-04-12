import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';

// 创建新分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: '分类名称和别名是必填项' },
        { status: 400 }
      );
    }
    
    console.log('创建新分类:', body.name);
    
    // 计算新分类的排序值
    let maxOrder = 0;
    if (body.parentId) {
      // 如果有父分类，获取同级分类的最大排序值
      const siblingCategories = await db.select({ order: schema.categories.order })
        .from(schema.categories)
        .where(eq(schema.categories.parentId, body.parentId))
        .orderBy(schema.categories.order);
      
      if (siblingCategories.length > 0) {
        maxOrder = siblingCategories[siblingCategories.length - 1].order;
      }
    } else {
      // 获取顶级分类的最大排序值
      const rootCategories = await db.select({ order: schema.categories.order })
        .from(schema.categories)
        .where(sql`${schema.categories.parentId} IS NULL`)
        .orderBy(schema.categories.order);
      
      if (rootCategories.length > 0) {
        maxOrder = rootCategories[rootCategories.length - 1].order;
      }
    }
    
    // 创建新分类，排序值加10
    const newCategory = await db.insert(schema.categories).values({
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      parentId: body.parentId || null,
      order: maxOrder + 10,
      createdAt: new Date().toISOString(),
    }).returning();
    
    console.log('分类创建成功:', newCategory[0].id);
    
    return NextResponse.json(newCategory[0]);
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json(
      { error: '创建分类失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
