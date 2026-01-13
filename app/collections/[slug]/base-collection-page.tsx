import { BannerWithCategories } from '@/app/components/page/banner-with-categories'
import { ListProductByCollection } from '@/app/components/products/list-product-by-collection'
import { API_URL, FRONTEND_PATH } from '@/lib/constants'
import { ICollection, IRelatedCategory, SlugPageCategoryBrandProps, SlugPageProps } from '@/lib/types/global'
import { ICategoryBase } from '@/lib/types/category'
import { camelizeKeys } from 'humps'
import { ListProductLoading } from '@/app/components/products/list-product-loading'
import * as React from 'react'

export async function getCollectionData(slug: string): Promise<ICollection | null> {
  const res = await fetch(`${API_URL}/api/collections/${slug}`, {
    next: { revalidate: 86400 },
  })

  if (!res.ok) {
    return null
  }

  const data = camelizeKeys(await res.json()) as { collection: ICollection }
  return data.collection
}

function findCategory(categories: IRelatedCategory[], slug: string): { category: IRelatedCategory | ICategoryBase, parent?: IRelatedCategory } | undefined {
  for (const cat of categories) {
    if (cat.slug === slug) return { category: cat }
    if (cat.children) {
      const child = cat.children.find((c) => c.slug === slug)
      if (child) return { category: child, parent: cat }
    }
  }
  return undefined
}

export const BaseCollectionPage = async ({ params }: SlugPageProps | SlugPageCategoryBrandProps) => {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const categorySlug = 'categorySlug' in resolvedParams ? resolvedParams.categorySlug : undefined
  const collectionData = await getCollectionData(slug)

  if (!collectionData) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Không tìm thấy bộ sưu tập</h1>
          <p className='text-gray-600'>Bộ sưu tập bạn tìm kiếm không tồn tại.</p>
        </div>
      </main>
    )
  }

  const found = categorySlug ? findCategory(collectionData.categories, categorySlug) : undefined
  const activeCategory = found?.category
  const parentCategory = found?.parent

  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Bộ sưu tập',
      link: FRONTEND_PATH.collections,
    },
    {
      label: collectionData.name,
      link: FRONTEND_PATH.collectionDetail(collectionData.slug),
    },
  ]

  if (categorySlug) {
    breadcrumbNodes.push({
      label: activeCategory ? activeCategory.title : 'Tất cả sản phẩm',
      link: activeCategory
        ? FRONTEND_PATH.collectionCategoryDetail(collectionData.slug, activeCategory.slug)
        : FRONTEND_PATH.collectionDetail(collectionData.slug),
    })
  }


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
      <BannerWithCategories
        data={collectionData}
        breadcrumbNodes={breadcrumbNodes}
        activeCategory={activeCategory}
        parentCategory={parentCategory}
        type='collection'
      />
      <div className='max-w-screen-2xl mx-auto min-h-360'>
        <React.Suspense fallback={<ListProductLoading />}>
          <ListProductByCollection collection={collectionData} activeCategory={activeCategory} parentCategory={parentCategory} />
        </React.Suspense>
      </div>
    </>
  )
}
