import { BannerWithCategories } from '@/app/components/page/banner-with-categories'
import { ListProductByBrand } from '@/app/components/products/list-product-by-brand'
import { API_URL, FRONTEND_PATH } from '@/lib/constants'
import { IBrand, IRelatedCategory, SlugPageCategoryBrandProps, SlugPageProps } from '@/lib/types/global'
import { ICategoryBase } from '@/lib/types/category'
import { camelizeKeys } from 'humps'
import * as React from 'react'
import { ListProductLoading } from '@/app/components/products/list-product-loading'

export async function getBrandData(slug: string): Promise<IBrand | null> {
  const res = await fetch(`${API_URL}/api/brands/${slug}`, {
    next: { revalidate: 86400 },
  })

  if (!res.ok) {
    return null
  }

  return camelizeKeys(await res.json()) as IBrand
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

export const BaseBrandsPage = async ({ params }: SlugPageProps | SlugPageCategoryBrandProps) => {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const categorySlug = 'categorySlug' in resolvedParams ? resolvedParams.categorySlug : undefined
  const brandData = await getBrandData(slug)

  if (!brandData) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Không tìm thấy thương hiệu</h1>
          <p className='text-gray-600'>Thương hiệu bạn tìm kiếm không tồn tại.</p>
        </div>
      </main>
    )
  }

  const found = categorySlug ? findCategory(brandData.categories, categorySlug) : undefined
  const activeCategory = found?.category
  const parentCategory = found?.parent

  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Thương hiệu',
      link: FRONTEND_PATH.brands,
    },
    {
      label: brandData.name,
      link: FRONTEND_PATH.brandDetail(brandData.slug),
    },
  ]

  if (categorySlug) {
    breadcrumbNodes.push({
      label: activeCategory ? activeCategory.title : 'Tất cả sản phẩm',
      link: activeCategory
        ? FRONTEND_PATH.brandCategoryDetail(brandData.slug, activeCategory.slug)
        : FRONTEND_PATH.brandDetail(brandData.slug),
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
        data={brandData}
        breadcrumbNodes={breadcrumbNodes}
        activeCategory={activeCategory}
        parentCategory={parentCategory}
        type='brand'
      />
      <div className='max-w-screen-2xl mx-auto min-h-360'>
        <React.Suspense fallback={<ListProductLoading />}>
          <ListProductByBrand brand={brandData} activeCategory={activeCategory} parentCategory={parentCategory} />
        </React.Suspense>
      </div>
    </>
  )
}
