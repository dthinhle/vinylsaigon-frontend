'use client'

import { API_URL } from '@/lib/constants'
import { camelizeKeys } from 'humps'
import { useState } from 'react'

import BlogCard from './blog-card'
import { ApiBlogPost, BlogPost, BlogsResponse } from './blog-data-types'

interface BlogListClientProps {
  initialBlogs: BlogPost[]
  initialPagination: BlogsResponse['pagination']
}

export default function BlogListClient({
  initialBlogs,
  initialPagination,
}: BlogListClientProps) {
  function transformBlogPost(apiBlog: ApiBlogPost): BlogPost {
    return {
      id: apiBlog.id,
      title: apiBlog.title,
      slug: apiBlog.slug,
      shortDescription: apiBlog.shortDescription,
      content: apiBlog.content,
      publishedAt: apiBlog.publishedAt,
      viewCount: apiBlog.viewCount || 0,
      imageUrl: apiBlog.imageUrl || '',
      author: apiBlog.author?.name || 'Admin',
      category: apiBlog.category || null,
    }
  }
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs)
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(false)

  const handleLoadMore = async () => {
    if (!pagination || !pagination.nextPage) return
    setLoading(true)
    try {
      const res = await fetch(
        `${API_URL}/api/blogs?page=${pagination.nextPage}&per_page=${pagination.perPage}`,
      )
      if (!res.ok) throw new Error('Failed to fetch blogs')
      const blogsData = camelizeKeys(await res.json()) as BlogsResponse
      const moreBlogs = blogsData.blogs.map(transformBlogPost)

      setBlogs((prev) => [...prev, ...moreBlogs])
      setPagination(blogsData.pagination)
    } catch (e) {
      // Optionally handle error
      console.error('Error loading more blogs:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* All Posts Section */}
      {blogs.length > 0 && (
        <div className='mx-auto mb-16 lg:px-12 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogs.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* No Posts Message */}
      {blogs.length === 0 && (
        <div className='text-center py-20'>
          <div className='text-6xl mb-4'>📰</div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>Không có bài viết nào</h3>
          <p className='text-gray-600'>Hiện tại không có bài viết nào trong danh mục này.</p>
        </div>
      )}

      {pagination &&
        pagination.totalPages > 1 &&
        pagination.currentPage < pagination.totalPages && (
          <div className='mx-auto mb-8 text-center'>
            {/* Read More */}
            <div className='pt-2 mt-auto'>
              <span
                onClick={handleLoadMore}
                className='px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 bg-black text-white hover:bg-white hover:text-black border border-black cursor-pointer'
              >
                {loading ? 'Đang tải...' : 'Tải Thêm'}
              </span>
            </div>
          </div>
        )}
    </>
  )
}
