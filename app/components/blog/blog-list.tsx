import { API_URL } from '@/lib/constants'
import { camelizeKeys } from 'humps'

import { ApiBlogPost, BlogPost, BlogsResponse } from './blog-data-types'
import BlogListClient from './blog-list-client'

// Transform API blog data to match BlogCard interface
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
    category: apiBlog.category
      ? { name: apiBlog.category.name, slug: apiBlog.category.slug }
      : null,
  }
}

async function getBlogs(
  page: number = 1,
  per_page: number = 9,
  categorySlug?: string,
): Promise<BlogsResponse> {
  const res = await fetch(
    `${API_URL}/api/blogs?page=${page}&per_page=${per_page}${categorySlug ? `&category=${categorySlug}` : ''}`,
    {
      next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch blogs')
  }

  return res.json()
}

interface BlogListProps {
  initialPage?: number
  initialPerPage?: number
  nextPerPage?: number
}

export default async function BlogList({
  initialPage = 1,
  initialPerPage = 9,
}: BlogListProps) {
  try {
    const blogsData = camelizeKeys(
      await getBlogs(initialPage, initialPerPage),
    ) as BlogsResponse
    const { blogs: apiBlogs, pagination } = blogsData

    // Transform API blogs to BlogCard format
    const blogs = apiBlogs.map(transformBlogPost)

    return (
      <div className='min-h-screen relative max-w-[calc(var(--breakpoint-2xl)_-_12rem)] mt-6 lg:mx-4 mx-2 gap-2'>
        <div className='blogs-wrapper'>
          {/* All Posts Section */}
          <BlogListClient
            initialBlogs={blogs}
            initialPagination={pagination}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching blog data:', error)

    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <div className='text-center max-w-md'>
          <div className='text-6xl mb-4'>⚠️</div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>Có lỗi xảy ra</h3>
          <p className='text-gray-600 mb-6'>Không thể tải tin tức. Vui lòng thử lại sau.</p>
        </div>
      </div>
    )
  }
}
