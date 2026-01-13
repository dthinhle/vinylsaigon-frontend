import { cn } from '@/lib/utils'
import * as React from 'react'
import { RefinementList, useRefinementList } from 'react-instantsearch'

import { ResponsiveFilter } from './responsive-filter'
import { PRODUCT_ATTRIBUTES, SHARED_CLASSES } from './static-list-product'

export interface BrandRefinementProps {
  type?: 'brand' | 'categories' | 'collection'
}

const BrandRefinementWithUI = React.memo(() => {
  return (
    <ResponsiveFilter title='Thương hiệu'>
      <RefinementList
        attribute={PRODUCT_ATTRIBUTES.BRANDS}
        limit={8}
        showMore={true}
        searchable={true}
        searchablePlaceholder='Tìm kiếm…'
        classNames={{
          ...SHARED_CLASSES.refinementList,
          root: cn(SHARED_CLASSES.refinementList.root, 'px-2'),
          searchBox: cn(
            'my-2 text-base w-full [&_.ais-SearchBox-form]:flex [&_.ais-SearchBox-input]:flex-grow',
            '[&_.ais-SearchBox-form]:gap-1',
            '[&_.ais-SearchBox-input]:focus-visible:outline-transparent [&_.ais-SearchBox-input>i]:focus:hidden',
            '[&_.ais-SearchBox-submitIcon]:size-2.5 [&_.ais-SearchBox-resetIcon]:size-2.5',
            '[&_.ais-SearchBox-submit,_&_.ais-SearchBox-reset]:p-1.5 [&_.ais-SearchBox-submit,_&_.ais-SearchBox-reset]:bg-gray-200 [&_.ais-SearchBox-submit,_&_.ais-SearchBox-reset]:rounded-sm',
          ),
        }}
        translations={{
          noResultsText: 'Không có kết quả',
          showMoreButtonText({ isShowingMore }) {
            return isShowingMore ? 'Ẩn bớt thương hiệu' : 'Hiện thêm thương hiệu'
          },
        }}
      />
    </ResponsiveFilter>
  )
})

BrandRefinementWithUI.displayName = 'BrandRefinementWithUI'

const BrandRefinementHookOnly = React.memo(() => {
  useRefinementList({ attribute: PRODUCT_ATTRIBUTES.BRANDS })
  return null
})

BrandRefinementHookOnly.displayName = 'BrandRefinementHookOnly'

export const BrandRefinement = React.memo(({ type }: BrandRefinementProps) => {
  if (type !== 'brand') {
    return <BrandRefinementWithUI />
  } else {
    return <BrandRefinementHookOnly />
  }
})

BrandRefinement.displayName = 'BrandRefinement'
