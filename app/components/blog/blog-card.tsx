import { montserrat } from '@/app/fonts'
import { cn, formatDate } from '@/lib/utils'
import logoSvg from '@/public/assets/logo.svg'
import Image from 'next/image'
import Link from 'next/link'

import { BlogCardProps } from './blog-data-types'

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className='group cursor-pointer'>
      <Link href={`/tin-tuc/${post.slug}`} className='flex flex-col'>
        {/* Image Container */}
        <div className='relative lg:h-96 lg:aspect-auto aspect-square w-full bg-linear-to-br from-gray-100 to-gray-200 mb-6 overflow-hidden'>
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className='object-cover object-center group-hover:scale-105 transition-transform duration-500'
              unoptimized
            />
          ) : (
            <div className='flex items-center justify-center h-full'>
              <Image
                src={logoSvg.src}
                alt='Default Logo'
                width={150}
                height={150}
                className='opacity-60'
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className='content-wrapper'>
          {/* Title */}
          <h2
            className={cn(
              montserrat.className,
              'text-lg mt-auto font-medium text-gray-950 group-hover:text-black transition-colors duration-200 leading-tight my-6 text-pretty h-16 ellipsis whitespace-normal',
            )}
          >
            {post.title}
          </h2>

          {/* Date */}
          <p className='text-sm text-gray-700 mb-4'>
            {post.publishedAt ? formatDate(post.publishedAt) : ''}
          </p>

          {/* Excerpt */}
          <p className='text-gray-600 h-40 overflow-hidden truncate whitespace-normal'>{post.shortDescription}</p>

          {/* Read More */}
          <div className='pt-2 mt-auto mb-12'>
            <span className='px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 bg-black text-white group-hover:bg-white group-hover:text-black border border-black'>
              ĐỌC TIẾP
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default BlogCard
