'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import TagifyInput from '@/components/TagifyInput';
import ImageUploader from '@/components/ImageUploader';
import IsolatedMarkdownEditor from '@/components/IsolatedMarkdownEditor';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pageType, setPageType] = useState('markdown'); // 添加页面类型状态
  const [tags, setTags] = useState('');
  const [tagsList, setTagsList] = useState<Array<{ id: number; name: string }>>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [autoUpdateSlug, setAutoUpdateSlug] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // 获取所有标签
  const fetchAllTags = async () => {
    try {
      setIsLoadingTags(true);
      const response = await fetch('/api/tags');

      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }

      const data = await response.json();
      setTagsList(data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    } finally {
      setIsLoadingTags(false);
    }
  };

  // 获取所有分类
  const fetchAllCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await fetch('/api/categories');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);

      // 尝试找到"未分类"分类并设置为默认
      const uncategorized = data.find((cat: any) =>
        cat.name === '未分类' || cat.slug === 'uncategorized'
      );
      if (uncategorized) {
        setCategoryIds([uncategorized.id]);
      } else if (data.length > 0) {
        // 如果没有"未分类"但有其他分类，使用第一个
        setCategoryIds([data[0].id]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Generate slug from title automatically when title changes and autoUpdateSlug is enabled
  useEffect(() => {
    if (title && autoUpdateSlug) {
      setSlug(generateSlug(title));
    }
  }, [title, autoUpdateSlug]);

  // 获取所有标签和分类
  useEffect(() => {
    fetchAllTags();
    fetchAllCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 确保 slug 不为空且格式正确
      if (!slug) {
        throw new Error('URL别名不能为空');
      }

      // 确保分类已选择
      if (!categoryIds || categoryIds.length === 0) {
        throw new Error('请选择至少一个文章分类');
      }

      // 创建文章
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          categoryIds,
          coverImage,
          published: true,
          pageType // 添加页面类型字段
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '创建文章失败');
      }

      const result = await response.json();

      // 处理分类关联
      if (result.id && categoryIds.length > 0) {
        try {
          const categoriesResponse = await fetch(`/api/posts/${result.id}/categories`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              categoryIds
            }),
          });

          if (!categoriesResponse.ok) {
            console.error('Failed to associate post with categories');
          }
        } catch (err) {
          console.error('Error associating post with categories:', err);
        }
      }

      // 处理标签
      let parsedTags: any[] = [];
      try {
        // 检查tags是否为空字符串
        if (tags && tags.trim() !== '') {
          parsedTags = JSON.parse(tags);
        }
      } catch (e) {
        console.error('Error parsing tags:', e);
      }

      if (parsedTags.length) {
        const tagsResponse = await fetch(`/api/posts/${result.id}/tags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tags: parsedTags
          }),
        });

        if (!tagsResponse.ok) {
          console.error('Failed to add post tags');
        }
      }

      toast({
        title: "创建成功",
        description: "文章已成功创建",
      });

      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || '创建文章失败');
      console.error(err);

      toast({
        title: "创建失败",
        description: err.message || "无法创建文章，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">创建新文章</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
            disabled={isLoading}
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? '创建中...' : '创建文章'}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 标题区域 - 突出显示 */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-3 text-2xl border-0 border-b focus:ring-0 focus:border-blue-500 font-medium"
            placeholder="文章标题"
            required
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 主要内容区域 - 占据更多空间 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 根据页面类型显示不同的编辑器 */}
            {pageType === 'markdown' ? (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Markdown 编辑器</h3>
                <IsolatedMarkdownEditor
                  value={content}
                  onChange={setContent}
                  height={600}
                />
              </div>
            ) : (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">HTML 编辑器</h3>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[600px] px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder="输入HTML代码..."
                />
              </div>
            )}
          </div>

          {/* 侧边栏 - 压缩其他元素 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border rounded-md p-4 bg-white shadow-sm">
              <h3 className="font-medium text-gray-700 mb-3">发布设置</h3>

              {/* 页面类型 */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">页面类型</label>
                <select
                  value={pageType}
                  onChange={(e) => setPageType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="markdown">Markdown 文章</option>
                  <option value="html">HTML 全页面</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  HTML全页面将直接显示您的HTML代码，不使用网站模板
                </p>
              </div>

              {/* URL别名 */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">URL 别名</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setAutoUpdateSlug(false);
                  }}
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <div className="mt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-update-slug"
                      checked={autoUpdateSlug}
                      onCheckedChange={(checked) => setAutoUpdateSlug(checked === true)}
                    />
                    <Label htmlFor="auto-update-slug" className="text-xs text-gray-500">
                      根据标题自动更新
                    </Label>
                  </div>
                </div>
              </div>

              {/* 分类 - 多选 */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">分类（可多选）</label>
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={categoryIds.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCategoryIds([...categoryIds, category.id]);
                          } else {
                            setCategoryIds(categoryIds.filter(id => id !== category.id));
                          }
                        }}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {categoryIds.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">请选择至少一个分类</p>
                )}
              </div>

              {/* 封面图片 */}
              <div className="mb-4">
                <ImageUploader
                  value={coverImage}
                  onChange={setCoverImage}
                  label="封面图片"
                  placeholder="选择或拖放封面图片到此处"
                />
              </div>

              {/* 标签 */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">标签</label>
                <TagifyInput
                  value={tags}
                  onChange={setTags}
                  whitelist={tagsList}
                  loading={isLoadingTags}
                  placeholder="输入标签..."
                  className="w-full text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  输入标签名称并按回车添加
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
