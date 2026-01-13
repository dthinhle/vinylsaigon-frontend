import { Banner } from '@/app/components/page'
import { CategoryBanner } from '@/app/components/page/category-banner'
import { ListProductByCategory } from '@/app/components/products/list-product-by-category'
import { ListProductLoading } from '@/app/components/products/list-product-loading'
import { API_URL, FRONTEND_PATH } from '@/lib/constants'
import { ICategory } from '@/lib/types/category'
import { SlugPageProps } from '@/lib/types/global'
import { getCategoryHierarchy } from '@/lib/utils'
import { camelizeKeys } from 'humps'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import * as React from 'react'

export const revalidate = 86400

async function getCategoryData(slugPath: string): Promise<ICategory | null> {
  const res = await fetch(`${API_URL}/api/categories/${slugPath}`, {
    next: { revalidate: 86400 },
  })

  if (!res.ok) {
    return null
  }

  return camelizeKeys(await res.json()) as ICategory
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string | string[] }>, searchParams: Promise<{ page?: string; per_page?: string }> }): Promise<Metadata> {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug
  const category = await getCategoryData(slugPath)

  if (!category) {
    return {
      title: 'Danh mục không tìm thấy - 3K Shop',
    }
 }

  const page = Number(resolvedSearchParams?.page ?? 1)
  const perPage = Number(resolvedSearchParams?.per_page ?? 24)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'
  const categoryUrlBase = `${baseUrl}/danh-muc/${slugPath}`
  const categoryUrl =
    page > 1 ? `${categoryUrlBase}?page=${page}&per_page=${perPage}` : categoryUrlBase

  const metaTitle = category.title
  const metaDescription =
    category.description || `Sản phẩm trong danh mục ${category.title} tại 3K Shop`

  // Prepare metadata with pagination structure as per SEO analysis
  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: categoryUrl, // Add canonical URL
    },
    openGraph: {
      title: `${metaTitle} | 3K Shop`,
      description: metaDescription,
      url: categoryUrl,
      images: [
        {
          url: category.thumbnail?.url || '/assets/logo.svg',
          alt: category.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metaTitle} | 3K Shop`,
      description: metaDescription,
      images: [category.thumbnail?.url || '/assets/logo.svg'],
    },
  }

  // According to SEO analysis #20, if pagination is implemented,
  // we should add rel="prev" and rel="next" tags to indicate the relationship between paginated pages
  // This prepares the structure for when pagination is eventually implemented
  // For now, we're just preparing the metadata structure without actual pagination logic
  // since the site currently uses infinite scroll

  return metadata
}

const PageBanner = ({
  category,
  breadcrumbNodes,
  activeSlug,
}: {
  category: ICategory
  breadcrumbNodes: Array<{ label: string; link: string }>
  activeSlug?: string
}) => {
  const hasChildren = category.children && category.children.length > 0
  const isSubcategory = category.parent !== null

  if (hasChildren || isSubcategory) {
    return (
      <CategoryBanner
        category={category}
        breadcrumbNodes={breadcrumbNodes}
        activeSlug={activeSlug}
      />
    )
  }

  return <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={category.thumbnail.url} />
}

const CategoryPage = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  // Join the slug array to create the full path
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug
  const categoryData = await getCategoryData(slugPath)

  if (!categoryData) {
    notFound()
  }

  // Generate breadcrumbs for the category
  const breadcrumbNodes: Array<{ label: string; link: string }> = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Sản phẩm',
      link: FRONTEND_PATH.products,
    },
  ]

  const categoryHierarchy = getCategoryHierarchy(categoryData)
  let hierarchicalPath = ''

  categoryHierarchy.forEach((cat, index) => {
    hierarchicalPath = hierarchicalPath ? `${hierarchicalPath}/${cat.slug}` : cat.slug
    const isLast = index === categoryHierarchy.length - 1

    breadcrumbNodes.push({
      label: cat.title,
      link: isLast ? '#' : FRONTEND_PATH.productCategory(hierarchicalPath),
    })
  })

  let activeCategory = categoryData.children.find((child) => child.isActive)
  activeCategory ??= categoryData

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbNodes.map((node, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: node.label,
      item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}${node.link}`,
    })),
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <PageBanner category={categoryData} breadcrumbNodes={breadcrumbNodes} activeSlug={slugPath} />
      <div className='max-w-screen-2xl mx-auto min-h-360'>
        <React.Suspense fallback={<ListProductLoading />}>
          <ListProductByCategory category={categoryData} activeCategory={activeCategory} />
        </React.Suspense>
      </div>
    </>
  )
}

export default CategoryPage
