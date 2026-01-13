'use client'

import { Card } from '@/components/ui/card'
import { FRONTEND_PATH } from '@/lib/constants'
import { ISimpleProduct } from '@/lib/types/product'
import { cn, extractHitImages, formatPrice } from '@/lib/utils'
import { calculatePriceInfo } from '@/lib/utils/format'
import { minBy } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { Highlight } from 'react-instantsearch'
import { ProductVariantButtons } from './product-variant-buttons'
import { ProductHit } from './static-list-product'

const PRODUCT_COLLECTION_LIMIT = 3

const STYLING_CLASSES = {
  dark: {
    textColor: 'text-zinc-50',
    backgroundColor: 'bg-zinc-950',
    borderColor: 'border-zinc-800',
    hoverBorderColor: 'hover:border-zinc-800',
  },
  light: {
    textColor: 'text-zinc-950',
    backgroundColor: 'bg-zinc-50',
    borderColor: 'border-zinc-200',
    hoverBorderColor: 'hover:border-zinc-200',
  },
}

const getCurrentImages = (
  selectedVariant: string | null,
  variants: ProductHit['variants'],
  defaultImages: [string | undefined, string | undefined],
): [string | undefined, string | undefined] => {
  if (selectedVariant && variants) {
    const variant = variants.find((v) => v.slug === selectedVariant)
    if (variant && variant.images && variant.images.length >= 2) {
      return [variant.images[0], variant.images[1]]
    } else if (variant && variant.images && variant.images.length === 1) {
      return [variant.images[0], undefined]
    }
  }
  return defaultImages
}

interface IProductCard {
  hit: ISimpleProduct | ProductHit
  showVariant?: boolean
  showProductName?: boolean
  dark?: boolean
}

export const ProductCard = React.memo(
  ({ hit, showVariant = true, showProductName = false, dark = false }: IProductCard) => {
    const images = React.useMemo(() => extractHitImages(hit), [hit])
    const router = useRouter()
    const [firstImage, secondImage] = images || []
    const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null)

    const { variants, collections, slug } = hit
    const prioritizedVariants = React.useMemo(() => {
      if (!variants?.length) return []

      const cheapestVariant = minBy(variants, (v) => v.currentPrice ?? v.originalPrice ?? Infinity)
      if (!cheapestVariant) return variants

      return [cheapestVariant, ...variants.filter(v => v.slug !== cheapestVariant.slug)]
    }, [variants])

    const currentVariant = React.useMemo(() => {
      if (selectedVariant) {
        return prioritizedVariants.find((v) => v.slug === selectedVariant)
      }
      return prioritizedVariants[0]
    }, [selectedVariant, prioritizedVariants])

    const { originalPrice, displayPrice, isOnSale } = React.useMemo(
      () => calculatePriceInfo(currentVariant?.originalPrice, currentVariant?.currentPrice),
      [currentVariant],
    )

    // Get current display images based on selected variant or default product images
    const currentImages = React.useMemo(
      () => getCurrentImages(selectedVariant, variants, [firstImage, secondImage]),
      [firstImage, secondImage, selectedVariant, variants],
    )

    // Construct URL with variant if selected
    const productUrl = React.useMemo(() => {
      const baseUrl = FRONTEND_PATH.productDetail(slug)
      if (!selectedVariant && prioritizedVariants.length > 0 && prioritizedVariants[0].slug !== variants[0].slug) {
        return `${baseUrl}?variant=${encodeURIComponent(prioritizedVariants[0].slug)}`
      }

      return selectedVariant ? `${baseUrl}?variant=${encodeURIComponent(selectedVariant)}` : baseUrl
    }, [slug, selectedVariant, prioritizedVariants, variants])

    // Handle card click to navigate to product detail page
    const handleCardClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (
          event.target &&
          (event.target as HTMLElement).dataset?.event === 'product-variant-button'
        ) {
          event.preventDefault()
          return
        }
        router.push(productUrl)
      },
      [router, productUrl],
    )

    const {
      textColor,
      backgroundColor,
      hoverBorderColor,
      borderColor,
    } = dark ? STYLING_CLASSES.dark : STYLING_CLASSES.light

    const fomattedCollections = React.useMemo(() => collections ? collections.filter(col => !['Khuyến mãi', 'Hàng mới về'].includes(col)) : [], [collections])

    return (
      <Card
        className={cn(
          hoverBorderColor,
          'overflow-hidden py-0 border border-transparent rounded shadow-none gap-0 cursor-pointer h-full',
        )}
        onClick={handleCardClick}
      >
        <div className={
          cn('aspect-4/5 lg:m-4 m-2 relative overflow-hidden rounded', dark ? 'bg-white' : '')
        }>
          {fomattedCollections && fomattedCollections.length > 0 && (
            <div className='absolute w-full bottom-3 z-10 space-x-2 flex justify-center'>
              {fomattedCollections.map((collection, index) => {
                if (index > PRODUCT_COLLECTION_LIMIT - 1) return null
                return (
                  <span
                    key={`collection-${collection}-${index}`}
                    className={cn(
                      textColor,
                      backgroundColor,
                      borderColor,
                      'border inline-block p-1 px-1.5 lg:text-sm/4 text-[8px]/3',
                    )}
                  >
                    {collection}
                  </span>
                )
              })}
            </div>
          )}
          {currentImages[1] && (
            <Image
              src={currentImages[1]}
              alt={hit.name}
              width={300}
              height={300}
              className={cn(
                'object-contain first-image w-full h-full',
                currentImages[1] ? '' : 'p-12',
              )}
              unoptimized
            />
          )}
          <Image
            src={currentImages[0] || '/assets/logo-black.svg'}
            alt={hit.name}
            width={300}
            height={300}
            className={cn(
              'object-contain second-image absolute top-0 w-full h-full bg-white rounded',
              currentImages[0] ? '' : 'p-12',
              currentImages[1] ? 'hover:opacity-0' : '',
            )}
            unoptimized
          />
        </div>
        {showProductName && (
          <h3 className={cn( 'md:text-lg font-medium mt-2 grow max-h-18 text-wrap ellipsis px-2')}>{hit.name}</h3>
        )}
        <div className={cn('grow px-4 text-center grid', !showVariant ? 'grid-rows-[1fr_auto]' : 'grid-rows-[auto_1fr_auto]')}>
          {showVariant && (
            <div className='h-12 mb-4'>
              {Array.isArray(hit.variants) && (
                <ProductVariantButtons
                  variants={prioritizedVariants}
                  selectedVariant={selectedVariant}
                  onVariantSelect={setSelectedVariant}
                />
              )}
            </div>
          )}

          <Link prefetch={false} href={productUrl}>
            <h3 className='text-base font-bold mb-4'>
              {/* TODO: Handle check ProductHit vs ISimpleProduct */}
              {'categories' in hit && <Highlight attribute='name' hit={hit} />}
            </h3>
          </Link>

          <div className='space-y-1 mb-8'>
            <p className={cn('text-lg mb-0', textColor)}>
              {displayPrice ? formatPrice(displayPrice) : 'Liên hệ'}
            </p>
            {isOnSale ? (
              <p className='text-sm text-gray-500 line-through'>{formatPrice(originalPrice)}</p>
            ) : <div className='h-[20px]'>&nbsp;</div>}
          </div>
        </div>
      </Card>
    )
  },
)

ProductCard.displayName = 'ProductCard'
