import { cn, formatPrice } from '@/lib/utils'
import { TransformItems } from 'instantsearch.js'
import { CurrentRefinementsConnectorParamsItem } from 'instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements'

import { BrandRefinement } from './brand-refinement'
import { sortOptions } from './search-client'
import { ProductSortBy } from './sort-by'
import {
  FACET_TRANSLATIONS,
  FLAGS_TRANSLATIONS,
  FacetValue,
  FlagValue,
  PRODUCT_ATTRIBUTES,
} from './static-list-product'

interface FilterBarProps {
  type?: 'brand' | 'categories' | 'collection'
}

export const currentRefinementTransform: TransformItems<CurrentRefinementsConnectorParamsItem> = (
  items,
) => {
  return items.map((item) => {
    const label = item.label as FacetValue
    const refinements = item.refinements.map((refinement) => {
      if (refinement.attribute == PRODUCT_ATTRIBUTES.FLAGS) {
        const label = refinement.label as FlagValue
        if (label in FLAGS_TRANSLATIONS) {
          // If the label is a known flag, replace it with the translation
          return {
            ...refinement,
            label: FLAGS_TRANSLATIONS[label] ?? label,
          }
        }

        return refinement
      } else if (refinement.attribute == PRODUCT_ATTRIBUTES.CATEGORIES_LV1) {
        // Split by " > " and take the last part for subcategory name
        const parts = refinement.label.split(' > ')
        return {
          ...refinement,
          label: parts[parts.length - 1],
        }
      } else if (refinement.attribute == PRODUCT_ATTRIBUTES.CURRENT_PRICE) {
        const numericMatch = refinement.label.match(/(\d+\.?\d*)/)
        if (numericMatch && numericMatch[0]) {
          const numericValue = numericMatch[0]
          return {
            ...refinement,
            label: refinement.label.replace(numericValue, formatPrice(numericValue)),
          }
        }
      }

      return refinement
    })

    return {
      ...item,
      refinements,
      label: FACET_TRANSLATIONS[label] || item.label,
    }
  })
}

export const FilterBar = ({ type }: FilterBarProps) => {
  return (
    <div className='flex lg:flex-row flex-col items-center justify-between lg:border-t lg:border-b lg:py-3 lg:px-1.5 border-gray-300'>
      <div className='flex lg:flex-row flex-col justify-start items-center lg:space-x-4 w-full'>
        {/* Always render RefinementList for brands, but conditionally hide it */}
        <BrandRefinement type={type} />
      </div>

      <div className='lg:w-1/6 w-full lg:border-b-0 border-b border-gray-300 lg:py-0 p-3 order-first lg:order-last'>
        <ProductSortBy
          items={sortOptions}
          className={cn(
            'w-full',
            'bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sea-buckthorn-500 focus:border-sea-buckthorn-500',
          )}
        />
      </div>
    </div>
  )
}
