'use client'

import { ICategory } from '@/lib/types/category'
import { SearchClient } from 'instantsearch.js'
import * as React from 'react'
import { Configure, InstantSearch } from 'react-instantsearch'

import { FilterBar } from './filter-bar'
import { FilterPanel } from './filter-panel'
import { InfiniteProductList } from './infinite-product-list'
import { ProductCard } from './product-card'
import { searchClient, searchStateMapping } from './search-client'

interface ListProductByCategoryProps {
  category: ICategory
  activeCategory: ICategory
}

export const ListProductByCategory = ({ category, activeCategory }: ListProductByCategoryProps) => {
  const filters = activeCategory.isRoot
    ? `categories.lv0 = "${activeCategory.title}"`
    : `categories.lv1 = "${category.title} > ${activeCategory.title}"`

  return (
    <InstantSearch
      indexName='products'
      searchClient={searchClient as unknown as SearchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      routing={{
        stateMapping: searchStateMapping,
      }}
    >
      <Configure filters={filters} />
      <div className='filter-wrapper'>
        <FilterBar type='categories' />
        <FilterPanel type='categories' />
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
