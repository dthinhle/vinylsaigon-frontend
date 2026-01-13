'use client'

import { montserrat } from '@/app/fonts'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

import { CompactProductCard } from './compact-product-card'
import { ISimpleRelatedProduct } from '@/lib/types/product'

interface RelatedProductsProps {
  products: ISimpleRelatedProduct[]
  showTitle?: boolean
}

const MIN_PRODUCTS_FOR_CAROUSEL = 2

const shouldUseCarousel = (productsLength: number): boolean => {
  return productsLength >= MIN_PRODUCTS_FOR_CAROUSEL
}

export const RelatedProducts = ({ products, showTitle = true }: RelatedProductsProps) => {
  if (!products || products.length === 0) {
    return null
  }
  const useCarousel = shouldUseCarousel(products.length)


  return (
    <section className={cn('lg:mb-12 mb-6', showTitle ? '' : 'lg:mb-4')}>
      {showTitle && <h2 className={cn(montserrat.className, 'text-2xl font-semibold text-gray-900 mb-6')}>
        Sản phẩm liên quan
      </h2>}

      {useCarousel ? (
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className='w-full'
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={`product-${product.id}-${product.slug}`} className='basis-4/5 md:basis-1/2 lg:basis-1/3'>
                <CompactProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='hidden sm:flex border-gray-300 text-gray-400' />
          <CarouselNext className='hidden sm:flex border-gray-300 text-gray-400' />
        </Carousel>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {products.map((product) => (
            <CompactProductCard key={`product-${product.id}-${product.slug}`} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
