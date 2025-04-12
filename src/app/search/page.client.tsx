'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import SearchFilters from '@/components/SearchFilters';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: string;
  tags?: {
    id: number;
    name: string;
    slug: string;
  }[] | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalPosts: number;
  totalPages: number;
}

interface SearchResponse {
  query: string;
  posts: Post[];
  filters: {
    categories: Category[];
    tags: Tag[];
  };
  pagination: Pagination;
}

interface SearchClientProps {
  initialQuery: string;
  initialCategoryId: string;
  initialTagId: string;
  initialPage: number;
}

export default function SearchClient({
  initialQuery,
  initialCategoryId,
  initialTagId,
  initialPage
}: SearchClientProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [page, setPage] = useState(initialPage);

  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') || initialQuery;
  const categoryId = searchParams.get('category') || initialCategoryId;
  const tagId = searchParams.get('tag') || initialTagId;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query && !categoryId && !tagId) {
        setLoading(false);
        setData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 构建搜索URL
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (categoryId) params.set('category', categoryId);
        if (tagId) params.set('tag', tagId);
        params.set('page', page.toString());
        params.set('pageSize', '10');
        params.set('_t', Date.now().toString()); // 防止缓存

        const response = await fetch(`/api/search?${params.toString()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`搜索失败: ${response.statusText}`);
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('搜索出错:', error);
        setError('搜索失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, categoryId, tagId, page]);

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    // 更新URL，保留当前的搜索参数
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);

    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mt-0">
      <div className="p-6 mb-4 border-b border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-2">搜索结果</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {query ? `搜索 "${query}" ` : ''}
          {loading ? '正在搜索...' : data?.pagination.totalPosts > 0
            ? `找到 ${data.pagination.totalPosts} 个结果`
            : '未找到匹配的结果'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <h2 className="text-xl font-medium text-red-800 dark:text-red-400 mb-2">错误</h2>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
      ) : !data || !data.posts || data.posts.length === 0 ? (
        <div className="p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-medium mb-2">
              {query || categoryId || tagId ? '未找到匹配的结果' : '请输入搜索关键词'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {query || categoryId || tagId
                ? '没有找到与您的搜索条件匹配的文章。'
                : '使用顶部的搜索框输入关键词进行搜索。'}
            </p>
            <button
              onClick={() => {
                // 重置所有筛选条件
                const params = new URLSearchParams();
                router.push('/search');
              }}
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              重置筛选条件
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* 搜索过滤器 */}
          <SearchFilters
            categories={data.filters.categories}
            tags={data.filters.tags}
            selectedCategory={categoryId}
            selectedTag={tagId}
          />

          {/* 搜索结果列表 */}
          <div className="space-y-0">
            {data.posts.map((post, index) => (
              <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
                <article
                  className={`flex flex-col sm:flex-row gap-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -mx-2 rounded-lg transition-colors ${
                    index !== data.posts.length - 1 ? 'mb-8 pb-8 border-b border-gray-100 dark:border-gray-700' : ''
                  }`}
                >
                  {post.coverImage ? (
                    <div className="sm:w-1/5 flex-shrink-0">
                      <div className="relative h-32 sm:h-24 overflow-hidden rounded-md">
                        <img
                          src={post.coverImage || '/images/default-thumbnail.png'}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className={`flex-1 flex flex-col ${!post.coverImage ? 'sm:ml-0' : ''}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>
                        {formatDate(post.createdAt)}
                      </span>
                    </div>

                    {/* 显示标签 */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={`tag-${post.id}-${tag.id}`}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* 分页 */}
          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-md ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  上一页
                </button>

                {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      pageNum === page
                        ? 'bg-primary-600 text-white dark:bg-primary-500'
                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(data.pagination.totalPages, page + 1))}
                  disabled={page === data.pagination.totalPages}
                  className={`px-3 py-1 rounded-md ${
                    page === data.pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  下一页
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
