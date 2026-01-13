import { IBrand, ICollection, IRelatedCategory } from '@/lib/types/global'
import { ICategoryBase } from '@/lib/types/category'
import { cn } from '@/lib/utils'
import { FRONTEND_PATH } from '@/lib/constants'
import * as React from 'react'

import { BannerWithCategoriesClient } from './banner-with-categories-client'
import { BannerTitle } from './banner-title'
import { BreadcrumbNav, BreadcrumbNode } from './breadcrumb-nav'
import Image from 'next/image'

interface BannerWithCategoriesProps {
  data: IBrand | ICollection
  breadcrumbNodes: BreadcrumbNode[]
  activeCategory: IRelatedCategory | ICategoryBase | undefined
  parentCategory: IRelatedCategory | undefined
  type: 'brand' | 'collection'
}

export const BannerWithCategories: React.FC<BannerWithCategoriesProps> = ({
  data,
  breadcrumbNodes,
  activeCategory,
  parentCategory,
  type,
}) => {
  const baseUrl = type === 'brand'
    ? FRONTEND_PATH.brandDetail(data.slug)
    : FRONTEND_PATH.collectionDetail(data.slug)

  let title = data.name
  let thumbnail = 'logoUrl' in data ? data.logoUrl : data.thumbnailUrl
  let backLink: string | undefined = undefined
  let categoriesToShow: any[] = data.categories.filter((c) => c.isRoot)
  let activeCategoryForCarousel = activeCategory

  if (activeCategory) {
    if (parentCategory) {
      // Child category active
      title = parentCategory.title
      backLink = baseUrl
      backLink = `${baseUrl}/${parentCategory.slug}`

      categoriesToShow = parentCategory.children || []
    } else {
      // Root category active
      title = activeCategory.title
      backLink = baseUrl // Go back to brand page
      categoriesToShow = (activeCategory as IRelatedCategory).children || []

      backLink = undefined
    }
  }

  const logoSize = categoriesToShow.length < 2 ? 60 : 40

  return (
    <div id='category-banner' className={'w-full lg:mt-19'}>
      {/* Header section with breadcrumb and title */}
      <div className={cn('px-6 mb-2 lg:px-10 max-w-screen-2xl mx-auto lg:pt-6 pt-20')}>
        <BreadcrumbNav
          classNames={{
            root: 'text-base space-y-2',
            link: 'tracking-tight text-gray-800 hover:text-gray-600 lg:text-sm',
          }}
          nodes={breadcrumbNodes.slice(0, -1)}
          renderLastSeparator={true}
        />

        {thumbnail ?
          <div className="flex flex-row items-center my-3 gap-4">
            <div className={cn('logo-wrapper aspect-square flex items-center shadow-sm rounded overflow-hidden', categoriesToShow.length < 2 ? 'size-15' : 'size-10')}>
              <Image src={thumbnail} alt={title} width={logoSize} height={logoSize} className="object-cover p-1" unoptimized />
            </div>
            <BannerTitle title={title} backLink={backLink} className='lg:mt-0 mt-0' />
          </div> :
          <BannerTitle title={title} backLink={backLink} />
        }
      </div>

      {/* Subcategories carousel section - now client component */}
      <BannerWithCategoriesClient
        categories={categoriesToShow}
        activeCategory={activeCategoryForCarousel}
        baseUrl={baseUrl}
      />
    </div>
  )
}
