'use client'

import { DEFAULT_VARIANT_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'
import * as React from 'react'

interface ProductVariantButtonsProps {
  variants: Array<{ name: string; slug: string; images: string[] }>
  selectedVariant: string | null
  onVariantSelect: (variantSlug: string | null) => void
}

export const ProductVariantButtons = React.memo(
  ({ variants, selectedVariant, onVariantSelect }: ProductVariantButtonsProps) => {
    if (!variants || variants.length === 0) return null

    const filteredVariants = variants.filter((variant) => variant.images.length > 0)
    const plusAmount = filteredVariants.length > 4 ? filteredVariants.length - 3 : null

    return (
      <div className='flex justify-center gap-3 items-center [&>button]:nth-[n+4]:hidden lg:[&>button]:nth-[n+4]:inline-flex'>
        {filteredVariants.map((variant) => (
          <button
            data-event='product-variant-button'
            key={variant.slug}
            onClick={(e) => {
              e.preventDefault() // Prevent Link navigation
              onVariantSelect(variant.slug === selectedVariant ? null : variant.slug)
            }}
            className={cn(
              'lg:size-12 size-10 rounded border-0 transition-all bg-(image:--variant-image) bg-cover bg-center cursor-pointer',
              selectedVariant === variant.slug
                ? 'border-atomic-tangerine-500 scale-110 border-2'
                : 'border-gray-200',
            )}
            style={
              {
                '--variant-image':
                  variant.images && variant.images.length > 0
                    ? `url(${variant.images[0]})`
                    : 'none',
              } as React.CSSProperties
            }
            title={variant.name === DEFAULT_VARIANT_NAME ? undefined : variant.name}
          />
        ))}
        {plusAmount && (
          <div
            className='lg:hidden size-5 text-xs rounded border-0 bg-gray-100 flex items-center justify-center text-gray-500 font-medium'
            title={`${plusAmount} variant khác`}
          >
            <span className='-ml-0.5'>+{plusAmount}</span>
          </div>
        )}
      </div>
    )
  },
)

ProductVariantButtons.displayName = 'ProductVariantButtons'
