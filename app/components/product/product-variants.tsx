'use client'

import { IProduct, PRODUCT_STOCK_STATUSES, TProductStockStatus } from '@/lib/types/product'
import { IProductVariant } from '@/lib/types/variant'
import { cn, formatPrice } from '@/lib/utils'
import { calculatePriceInfo } from '@/lib/utils/format'
import * as React from 'react'

import AddToCartButton from './add-to-cart-button'

type Props = {
  product: IProduct
  selectedVariant: IProductVariant
  setSelectedVariant: (selectedVariant: IProductVariant) => void
  stockStatus: TProductStockStatus
}

const ProductVariants: React.FC<Props> = ({
  product,
  selectedVariant,
  setSelectedVariant,
  stockStatus,
}) => {
  const { variants } = product
  const orderedVariants = React.useMemo(() => {
    if (!variants || variants.length === 0) return []

    const sortedVariants = [...variants].sort((a, b) => {
      const aIsActive = a.status === 'active'
      const bIsActive = b.status === 'active'

      if (aIsActive && !bIsActive) return -1
      if (!aIsActive && bIsActive) return 1

      return a.name.localeCompare(b.name)
    })

    return sortedVariants
  }, [variants])

  const { originalPrice, displayPrice, isOnSale, discountPercentage } = calculatePriceInfo(
    selectedVariant?.originalPrice,
    selectedVariant?.currentPrice,
  )

  const shouldShowPrice = stockStatus !== PRODUCT_STOCK_STATUSES.DISCONTINUED_PRODUCT
  const formattedPrice = displayPrice ? formatPrice(displayPrice) : 'Liên hệ'

  const formattedOriginalPrice = originalPrice > 0 ? formatPrice(originalPrice) : ''
  const variantStockStatus = product.status === 'temporarily_unavailable' || selectedVariant.status === 'inactive' ? PRODUCT_STOCK_STATUSES.OUT_OF_STOCK : stockStatus

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3 flex-wrap'>
          <p className={'text-xl md:text-2xl font-bold text-gray-900'}>{formattedPrice}</p>
          {shouldShowPrice && isOnSale && (
            <>
              <p className='text-sm md:text-base text-gray-500 line-through'>
                {formattedOriginalPrice}
              </p>
              <span className='bg-atomic-tangerine-100 text-atomic-tangerine-800 text-sm font-medium px-1.5 py-0.5 rounded'>
                -{discountPercentage}%
              </span>
            </>
          )}
        </div>
      </div>
      {variants.length > 1 && (
        <>
          <div className='border-b border-gray-300'></div>
          <div className='flex flex-wrap gap-3'>
            {orderedVariants.map((variant, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    'p-2 border cursor-pointer transition-all text-sm relative overflow-clip rounded',
                    selectedVariant.sku === variant.sku
                      ? 'bg-atomic-tangerine-900 border-transparent text-white shadow-sm'
                      : 'border-atomic-tangerine-900 text-atomic-tangerine-900',
                    variant.status !== 'active' ? 'bg-[linear-gradient(to_left_top,transparent_48.5%,var(--cross-out-color)_49.75%,var(--cross-out-color)_50.25%,transparent_51.5%)] bg-no-repeat' : '',
                  )}
                  style={{ '--cross-out-color': 'var(--color-atomic-tangerine-900)' } as React.CSSProperties}
                  onClick={() => {
                    setSelectedVariant(variant)
                  }}
                >
                  {variant.name}
                </div>
              )
            })}
          </div>
        </>
      )}

      <AddToCartButton
        product={product}
        selectedVariant={selectedVariant}
        stockStatus={variantStockStatus}
      />
    </>
  )
}

export default ProductVariants
