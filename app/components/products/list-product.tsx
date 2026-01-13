'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { debounce } from 'lodash'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { InstantSearch, UseSearchBoxProps, useSearchBox } from 'react-instantsearch'

import { FilterBar } from './filter-bar'
import { FilterPanel } from './filter-panel'
import { InfiniteProductList } from './infinite-product-list'
import { ProductCard } from './product-card'
import { defaultSearchConfig, searchStateMapping } from './search-client'

interface IListProductProps {
  search?: boolean
}

const SearchBox = ({ className, ...props }: UseSearchBoxProps & { className?: string }) => {
  const { query, refine, clear } = useSearchBox(props)
  const [displayValue, setDisplayValue] = React.useState<string>(query)

  function handleClear(): void {
    setDisplayValue('')
    clear()
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        value={displayValue}
        onChange={(event) => {
          const value = event.currentTarget.value
          setDisplayValue(value)
          debounce(() => refine(value), 200)()
        }}
        placeholder='Tìm kiếm sản phẩm...'
      />
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        onClick={handleClear}
        disabled={!displayValue.length}
      >
        <XIcon className='h-4 w-4' />
        <span className='sr-only'>Clear</span>
      </Button>
    </div>
  )
}

export const ListProduct = ({ search }: IListProductProps) => {
  return (
    <InstantSearch
      {...defaultSearchConfig}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      routing={{
        stateMapping: searchStateMapping,
      }}
    >
      {search && (
        <SearchBox className='max-w-md md:mx-auto mx-4 mb-4' />
      )}
      <div className='filter-wrapper'>
        <FilterBar />
        <FilterPanel />
      </div>
      <div className='result-wrapper lg:mx-4 mt-2 lg:min-h-240'>
        <InfiniteProductList
          hitComponent={ProductCard}
          classNames={{ list: 'grid lg:grid-cols-4 grid-cols-2' }}
          showPrevious={false}
        />
      </div>
    </InstantSearch>
  )
}
