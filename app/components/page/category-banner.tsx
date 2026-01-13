import { ICategory } from '@/lib/types/category'
import { cn } from '@/lib/utils'
import * as React from 'react'

import { BreadcrumbNav, BreadcrumbNode } from './breadcrumb-nav'
import { CategoryBannerClient } from './category-banner-client'
import { CategoryTitle } from './category-title'

interface CategoryBannerProps {
  category: ICategory
  breadcrumbNodes: BreadcrumbNode[]
  activeSlug?: string
}

export const CategoryBanner: React.FC<CategoryBannerProps> = ({
  category,
  breadcrumbNodes,
  activeSlug,
}) => {
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

        <CategoryTitle category={category} activeSlug={activeSlug} />
      </div>

      {/* Subcategories carousel section - now client component */}
      <CategoryBannerClient category={category} activeSlug={activeSlug} />
    </div>
  )
}
