import { BlogPost } from '@/app/components/blog/blog-data-types'
import BlogViewCount from '@/app/components/blog/blog-view-count'
import { RelatedProducts } from '@/app/components/blog/related-products'
import { BreadcrumbNav, BreadcrumbNode } from '@/app/components/page/breadcrumb-nav'
import { montserrat } from '@/app/fonts'
import { API_URL, FRONTEND_PATH } from '@/lib/constants'
import { getAlternateUrls } from '@/lib/language-utils'
import { SlugPageProps } from '@/lib/types/global'
import { cn } from '@/lib/utils'
import { LexicalContentRenderer } from '@/lib/utils/lexical-renderer'
import logoBlack from '@/public/assets/logo-black.svg'
import logoSvg from '@/public/assets/logo.svg'
import { camelizeKeys } from 'humps'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_URL}/api/blogs/${slug}`, {
    next: {
      revalidate: 86400, // ISR: revalidate every 24 hours
      tags: [`blog-${slug}`, 'blogs'], // Add cache tags for on-demand revalidation
    },
    headers: {
      Purpose: 'prefetch', // Tell backend this is a prefetch request
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch the blog')
  }

  return camelizeKeys(await res.json()) as BlogPost
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) {
    return {
      title: 'Bài viết không tìm thấy - 3K Shop',
    }
  }

  const metaTitle = post.title || 'Bài viết không tìm thấy'
  const metaDescription = post.shortDescription || 'Xem bài viết chi tiết tại 3K Shop'
  const metaUrl = `${API_URL}/tin-tuc/${post.slug}`
  const metaImageUrl = post.imageUrl || logoSvg.src

  // build hreflang alternates for this article
  const alternatesList = getAlternateUrls(
    `/tin-tuc/${post.slug}`,
    process.env.NEXT_PUBLIC_APP_URL || API_URL || '',
  )
  const languages: Record<string, string> = {}
  alternatesList.forEach((a) => {
    if (a.lang === 'vi' || a.lang === 'en') {
      languages[a.lang] = a.url
    }
  })

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: metaUrl,
      languages,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      url: metaUrl,
      images: [
        {
          url: metaImageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: SlugPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) {
    notFound()
  }
  const breadcrumbNodes: Array<BreadcrumbNode> = [
    { label: 'Trang chủ', link: FRONTEND_PATH.root },
    { label: 'Tin Tức', link: '/tin-tuc' },
    { label: post?.title || 'Bài viết', link: FRONTEND_PATH.newsDetail(post.slug) },
  ]

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbNodes.map((node, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: node.label,
      item: `${process.env.NEXT_PUBLIC_APP_URL || API_URL}${node.link}`,
    })),
  }

  // Generate Article Schema (BlogPosting)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.shortDescription || post.title,
    image: post.imageUrl || `${process.env.NEXT_PUBLIC_APP_URL || API_URL}/assets/logo.svg`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt, // Assuming published date is used as modified date if not available
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: '3K Shop',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL || API_URL}/assets/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL || API_URL}/tin-tuc/${post.slug}`,
    },
  }

  return (
    <main className='min-h-screen'>
      {/* Add Article Schema JSON-LD */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {/* Add Breadcrumb Schema JSON-LD */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <div className='flex justify-start lg:mt-19'>
        <div className='px-6 mb-2 lg:px-10 max-w-screen-2xl w-full mx-auto lg:pt-6 pt-20'>
          <BreadcrumbNav
            nodes={breadcrumbNodes}
            classNames={{
              root: 'text-base space-y-2',
              link: 'tracking-tight text-gray-800 hover:text-gray-600 lg:text-sm',
            }}
          />
        </div>
      </div>
      <section className='py-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
        <div className='order-1 md:order-1 flex justify-center items-center'>
          <div className='w-full h-80 md:h-120 lg:h-140 relative overflow-hidden'>
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.title || 'Blog Image'}
                fill
                className='object-contain lg:object-right object-center'
                priority
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
                unoptimized
              />
            ) : (
              <div className='flex items-center justify-center h-full bg-linear-to-br from-gray-100 to-gray-200'>
                <Image
                  src={logoSvg.src}
                  alt='Default Logo'
                  width={320}
                  height={320}
                  className='opacity-60'
                />
              </div>
            )}
          </div>
        </div>
        <div className='order-2 md:order-2 lg:px-24 md:px-12 px-6 max-w-screen-lg'>
          <Image alt='Logo 3K Shop' src={logoBlack} className='w-36 h-auto my-12 md:block hidden' unoptimized />
          <h1
            className={cn(
              montserrat.className,
              'text-2xl lg:text-4xl font-medium text-gray-900 md:mb-6 mb-2 text-pretty break-words',
            )}
          >
            {post.title}
          </h1>
          <div className='text-gray-500 md:mb-8 mb-2'>
            <span className='text-lg'>{post.author}</span>

            <span className='mx-2'>|</span>
            <span className='text-sm'>
              {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              - <BlogViewCount slug={post.slug} initialCount={post.viewCount} />
            </span>
          </div>
        </div>
      </section>
      <main className='max-w-6xl md:mx-auto px-6'>
        {post.products && post.products.length > 0 && <RelatedProducts products={post.products} showTitle={false} />}

        <article className='max-w-full text-gray-900 mb-8 prose prose-lg leading-relaxed text-left'>
          <LexicalContentRenderer content={post.content} />
        </article>

        {post.products && post.products.length > 0 && <RelatedProducts products={post.products} />}
      </main>
      <nav className='lg:px-8 px-4'>
        <div className='max-w-6xl mx-auto flex md:flex-row flex-col justify-between items-center py-8 lg:space-y-0 space-y-4'>
          <div className='previous-post flex-1 md:self-auto self-start'>
            {post.previousPost && (
              <Link
                href={FRONTEND_PATH.newsDetail(post.previousPost.slug)}
                className='hover:underline text-gray-950 hover:text-gray-700 flex md:items-center items-center gap-2'
              >
                <ArrowLeft strokeWidth={1.25} className='min-w-6 lg:order-0 order-1' />
                <span className='line-clamp-2'>
                  <span className='lg:hidden font-bold mr-2'>Bài viết trước:</span>
                  {post.previousPost.title}
                </span>
              </Link>
            )}
          </div>
          <div className='go-to-news flex-1 text-center md:py-0 py-3 md:order-0 order-2'>
            <Link href={FRONTEND_PATH.news} className='text-gray-950 font-bold hover:underline'>
              Quay lại Tin Tức
            </Link>
          </div>
          <div className='next-post flex-1 md:self-auto self-end'>
            {post.nextPost && (
              <Link
                href={FRONTEND_PATH.newsDetail(post.nextPost.slug)}
                className='hover:underline justify-end text-gray-950 hover:text-gray-700 flex items-center gap-2'
              >
                <span className='line-clamp-2'>
                  <span className='lg:hidden font-bold mr-2'>Bài viết tiếp theo:</span>
                  {post.nextPost.title}
                </span>
                <ArrowRight strokeWidth={1.25} className='min-w-6' />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </main>
  )
}
