'use client'

import { IBrand, IRelatedCategory } from '@/lib/types/global'
import { ICategoryBase } from '@/lib/types/category'
import { SearchClient } from 'instantsearch.js'
import * as React from 'react'
import { Configure, InstantSearch } from 'react-instantsearch'

import { FilterBar } from './filter-bar'
import { FilterPanel } from './filter-panel'
import { InfiniteProductList } from './infinite-product-list'
import { ProductCard } from './product-card'
import { baseStateMapping, searchClient } from './search-client'

interface ListProductByBrandProps {
  brand: IBrand
  parentCategory?: IRelatedCategory
  activeCategory: IRelatedCategory | ICategoryBase | undefined
}

export const ListProductByBrand = ({ brand, activeCategory, parentCategory }: ListProductByBrandProps) => {
  const filters = [`brands = "${brand.name}"`]
  if (activeCategory) {
    if (activeCategory.isRoot) {
      filters.push(`categories.lv0 = "${activeCategory.title}"`)
    } else {
      filters.push(`categories.lv1 = "${parentCategory?.title} > ${activeCategory.title}"`)
    }
  }

  return (
    <InstantSearch
      indexName='products'
      searchClient={searchClient as unknown as SearchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      routing={{
        stateMapping: baseStateMapping,
      }}
    >
      <Configure filters={filters.join(' AND ')} />
      <div className='filter-wrapper'>
        <FilterBar type='brand' />
        <FilterPanel type='brand' />
      </div>
      <div className='result-wrapper lg:mx-4 mt-4 lg:min-h-240'>
        <InfiniteProductList
          hitComponent={ProductCard}
          classNames={{ list: 'grid lg:grid-cols-4 grid-cols-2' }}
          showPrevious={false}
        />
      </div>
    </InstantSearch>
  )
}
