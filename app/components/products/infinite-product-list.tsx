'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'
import { InfiniteHitsProps, useInfiniteHits, useInstantSearch } from 'react-instantsearch'

import { ProductCard } from './product-card'
import { ProductHit } from './static-list-product'

export const InfiniteProductList = (props: InfiniteHitsProps<ProductHit>) => {
  const { status } = useInstantSearch()
  const { items, isLastPage, showMore } = useInfiniteHits<ProductHit>(props)
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isLastPage) {
              debounce(() => showMore(), 200)()
            }
          })
        },
        {
          rootMargin: '400px 0px 0px 0px',
        },
      )

      observer.observe(sentinelRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [isLastPage, showMore, items])

  return (
    <ul className={cn('ais-InfiniteHits-list', props.classNames?.list)}>
      {items.map((hit: ProductHit, index: number) => (
        <li key={`$${hit.slug}-${index}`} className='ais-InfiniteHits-item'>
          <ProductCard hit={hit} />
        </li>
      ))}
      {['stalled', 'loading'].includes(status) && (
        <>
          {[...new Array(4)].map((_, index) => (
            <li key={`skeleton-${index}`} className='p-4'>
              <Skeleton className='ais-InfiniteHits-item lg:h-128 h-90 w-full bg-gray-200' />
            </li>
          ))}
        </>
      )}
      {/* Only show sentinel when not loading and not on last page */}
      {!['stalled', 'loading'].includes(status) && !isLastPage && (
        <li className='ais-InfiniteHits-sentinel' ref={sentinelRef} aria-hidden='true' />
      )}
    </ul>
  )
}
