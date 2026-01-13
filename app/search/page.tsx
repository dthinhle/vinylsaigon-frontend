import { ListProduct } from '@/app/components/products/list-product'
import { FRONTEND_PATH } from '@/lib/constants'
import allProducts from '@/public/assets/all-products.webp'
import type { Metadata } from 'next'

import { BreadcrumbNav } from '../components/page'
import { ListProductLoading } from '../components/products/list-product-loading'
import * as React from 'react'

// Function to generate metadata with pagination support
async function generateMetadataWithPagination(): Promise<Metadata> {
  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/search`

  // Prepare pagination metadata structure as recommended in SEO analysis
  // This structure is ready for when pagination is implemented in the future
  const title = 'Kết quả tìm kiếm'
  const description = 'Tìm kiếm tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động tại Vinyl Sài Gòn. Tìm sản phẩm yêu thích với giá cả hợp lý.'
  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      type: 'website',
      images: [
        {
          url: allProducts.src,
          width: 3000,
          height: 1994,
          alt: 'Kết quả tìm kiếm | Vinyl Sài Gòn',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [allProducts.src],
    },
  }

  // According to SEO analysis #20, if pagination is implemented,
  // we should add rel="prev" and rel="next" tags to indicate the relationship between paginated pages
  // This prepares the structure for when pagination is eventually implemented
  // For now, we're just preparing the metadata structure without actual pagination logic
  // since the site currently uses infinite scroll

  return metadata
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] }>
}): Promise<Metadata> {
  const params = (await searchParams) || {}
  const page = Number(params?.page ?? 1)
  const perPage = Number(params?.per_page ?? 24)
  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/search`
  const canonical = page > 1 ? `${baseUrl}?page=${page}&per_page=${perPage}` : baseUrl

  const metadata = await generateMetadataWithPagination()
  metadata.alternates = metadata.alternates || {}
  metadata.alternates.canonical = canonical
  if (metadata.openGraph) {
    metadata.openGraph.url = canonical
  }
  return metadata
}

export const revalidate = 86400

export default function SearchPage() {
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Tất cả sản phẩm',
      link: FRONTEND_PATH.products,
    },
  ]
  return (
    <>
      <div className='mt-19 max-w-screen-2xl mx-auto min-h-360'>
        <BreadcrumbNav
          nodes={breadcrumbNodes}
          renderLastSeparator={true}
          classNames={{
            root: 'p-6 lg:px-20 max-w-screen-2xl mx-auto pt-8',
            link: 'lg:text-sm text-black',
          }}
        />
        <React.Suspense fallback={<ListProductLoading search />}>
          <ListProduct search />
        </React.Suspense>
      </div>
    </>
  )
}
