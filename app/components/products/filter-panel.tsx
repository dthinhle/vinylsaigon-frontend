import { cn } from '@/lib/utils'
import * as React from 'react'
import { CurrentRefinements } from 'react-instantsearch'
import { currentRefinementTransform } from './filter-bar'
import { PRODUCT_ATTRIBUTES } from './static-list-product'

export interface FilterPanelProps {
  type?: 'brand' | 'categories' | 'collection'
}

export const FilterPanel = ({ type }: FilterPanelProps) => {
  const excludedAttributes = React.useMemo(() => {
    const ignoreAttributes = [PRODUCT_ATTRIBUTES.QUERY]
    switch (type) {
      case 'brand':
        return [...ignoreAttributes, PRODUCT_ATTRIBUTES.BRANDS]
      case 'categories':
        return [
          ...ignoreAttributes,
          PRODUCT_ATTRIBUTES.CATEGORIES_LV0,
          PRODUCT_ATTRIBUTES.CATEGORIES_LV1,
        ]
      case 'collection':
        return [...ignoreAttributes, PRODUCT_ATTRIBUTES.COLLECTIONS]
      default:
        return ignoreAttributes
    }
  }, [type])
  return (
    <div
      className={cn( 'flex lg:flex-row flex-col lg:gap-12 lg:justify-start-safe overflow-hidden transition-all duration-200 lg:p-3')}
    >
      <CurrentRefinements
        className='lg:p-0 py-2 px-4 lg:overflow-y-unset overflow-y-scroll no-scrollbar'
        classNames={{
          item: 'flex gap-2',
          label: 'font-medium text-nowrap',
          list: 'flex flex-row lg:gap-6 gap-2 text-sm',
          category: cn(
            'text-nowrap [&_.ais-CurrentRefinements-delete]:cursor-pointer [&_.ais-CurrentRefinements-delete]:ml-1',
            '[&_.ais-CurrentRefinements-delete]:text-sm/4 [&_.ais-CurrentRefinements-delete]:p-[2px_5px]',
            '[&_.ais-CurrentRefinements-delete]:bg-atomic-tangerine-200 [&_.ais-CurrentRefinements-delete]:rounded',
            '[&_.ais-CurrentRefinements-delete]:hover:bg-atomic-tangerine-300',
          ),
        }}
        excludedAttributes={excludedAttributes}
        transformItems={currentRefinementTransform}
      />
    </div>
  )
}
