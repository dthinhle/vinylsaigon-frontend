import { BreadcrumbNav } from '@/app/components/page'
import { BannerTitle } from '@/app/components/page/banner-title'
import { SubcategoryCard } from '@/app/components/page/subcategory-card'
import { ListProduct } from '@/app/components/products/list-product'
import { ListProductLoading } from '@/app/components/products/list-product-loading'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { FRONTEND_PATH } from '@/lib/constants'
import { ICategoryBase } from '@/lib/types/category'
import { cn } from '@/lib/utils'
import allProducts from '@/public/assets/all-products.webp'
import type { Metadata } from 'next'
import * as React from 'react'
import { getRootCategories } from '../api/products'
import { sortCategoriesByTitle } from '@/lib/utils/sort-categories'

const metaTitle = 'Tất cả sản phẩm'
const metaDescription =
  'Khám phá toàn bộ bộ sưu tập tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động tại Vinyl Sài Gòn. Chất lượng cao, giá cả hợp lý.'

// Function to generate metadata with pagination support
async function generateMetadataWithPagination(): Promise<Metadata> {
  // For now, we'll prepare the structure for pagination without implementing actual pagination
  // This follows SEO analysis #20 recommendation to add rel="prev" and rel="next" tags
  // when pagination is eventually implemented
  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/san-pham`

  // Prepare pagination metadata structure as recommended in SEO analysis
  // This structure is ready for when pagination is implemented in the future
  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: baseUrl,
      type: 'website',
      images: [
        {
          url: allProducts.src,
          width: 3000,
          height: 1994,
          alt: 'Tất cả sản phẩm | Vinyl Sài Gòn',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
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


const PageBanner = ({
  categories,
  breadcrumbNodes,
}: {
  categories: ICategoryBase []
  breadcrumbNodes: Array<{ label: string; link: string }>
}) => {
  return (
    <div id='category-banner' className={'w-full lg:mt-21'}>
      {/* Header section with breadcrumb and title */}
      <div className={cn('px-6 mb-2 lg:px-10 max-w-screen-2xl mx-auto lg:pt-6 pt-24')}>
        <BreadcrumbNav
          classNames={{
            root: 'text-base space-y-2',
            link: 'tracking-tight text-gray-800 hover:text-gray-600 lg:text-sm',
          }}
          nodes={breadcrumbNodes.slice(0, -1)}
          renderLastSeparator={true}
        />

        <BannerTitle title={'Sản phẩm'} />
      </div>

      <div className='bg-white/10 backdrop-blur-sm my-4 border-t border-white/20'>
        <div className='max-w-screen-2xl mx-auto'>
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className='w-full'
          >
            <CarouselContent className={'pt-2'}>
              {
                sortCategoriesByTitle(categories).map((subcategory) => (
                <CarouselItem key={subcategory.id} className={'lg:first:ml-8 lg:last:mr-8 first:ml-4 last:mr-4 basis-2/5 lg:basis-2/7 xl:basis-3/13'}>
                  <SubcategoryCard subcategory={subcategory}/>
                </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselPrevious className='disabled:hidden sm:flex left-6 bg-gray-50 border-white/30 text-gray-800 hover:bg-gray-200' />
            <CarouselNext className='disabled:hidden sm:flex right-6 bg-gray-50 border-white/30 text-gray-800 hover:bg-gray-200' />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/san-pham`
  const canonical = baseUrl

  const metadata = await generateMetadataWithPagination()
  metadata.alternates = metadata.alternates || {}
  metadata.alternates.canonical = canonical
  if (metadata.openGraph) {
    metadata.openGraph.url = canonical
  }
  return metadata
}

export const revalidate = 86400

export default async function Page() {
  const categories = await getRootCategories()
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
      <PageBanner categories={categories} breadcrumbNodes={breadcrumbNodes} />
      <div className='max-w-screen-2xl mx-auto min-h-360'>
        <React.Suspense fallback={<ListProductLoading />}>
          <ListProduct />
        </React.Suspense>
      </div>
    </>
  )
}
