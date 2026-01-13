'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { CurrentRefinements, useHits } from 'react-instantsearch'

import { currentRefinementTransform } from './filter-bar'
import { ProductHit } from './static-list-product'

interface RefinementsPortalProps {
  excludedAttributes: string[]
}

export const RefinementsPortal = ({ excludedAttributes }: RefinementsPortalProps) => {
  const [mounted, setMounted] = useState(false)
  const { results } = useHits<ProductHit>()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || typeof document === 'undefined') {
    return null
  }

  return (
    <>
      {results?.getRefinements() &&
        ReactDOM.createPortal(
          <CurrentRefinements
            className={cn(
              'fixed max-w-[calc(100vw-2rem)] overflow-auto bottom-4 left-4 lg:hidden [&:not(:has(li))]:hidden p-3 bg-white/80 backdrop-blur-md z-60 rounded-lg',
            )}
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
          />,
          document.body,
        )}
    </>
  )
}
