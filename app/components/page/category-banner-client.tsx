'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { sortCategoriesByTitle } from '@/lib/utils/sort-categories'
import { ICategory } from '@/lib/types/category'
import * as React from 'react'

import { SubcategoryCard } from './subcategory-card'

interface CategoryBannerClientProps {
  category: ICategory
  activeSlug?: string
}

const getCarouselConfig = (count: number) => {
  switch (count) {
    case 2:
      return { wrapper: 'pt-2 px-4 flex flex-row gap-4', base: 'basis-1/2 [&_.category-card]:lg:aspect-2/1 [&_.category-card]:aspect-square' }
    case 3:
      return {
        wrapper: 'pt-2 flex flex-row gap-4 mx-4',
        base: 'not-first:pl-1 basis-1/2 lg:basis-1/3 xl:basis-1/4',
      }
    default:
      return {
        wrapper: 'pt-2',
        base: 'lg:first:ml-8 lg:last:mr-8 first:ml-4 last:mr-4 basis-2/5 lg:basis-2/7 xl:basis-3/13',
      }
  }
}

const SubcategoryList = ({
  subcategories,
  activeSlug,
  itemClassName,
  isCarousel = false,
}: {
  subcategories: ICategory[]
  activeSlug?: string
  itemClassName: string
  isCarousel?: boolean
}) => {
  return (
    <>
      {subcategories.map((subcategory) => {
        const isActive = subcategory.isActive || (activeSlug ? activeSlug.endsWith(subcategory.slug) : false)
        const content = <SubcategoryCard subcategory={subcategory} isActive={isActive} />

        return isCarousel ? (
          <CarouselItem key={subcategory.id} className={itemClassName}>
            {content}
          </CarouselItem>
        ) : (
          <div key={subcategory.id} className={itemClassName}>
            {content}
          </div>
        )
      })}
    </>
  )
}

export const CategoryBannerClient: React.FC<CategoryBannerClientProps> = ({
  category,
  activeSlug,
}) => {
  const subcategories = React.useMemo(() => sortCategoriesByTitle(category.children || []), [category])
  const count = subcategories.length

  const activeIndex = React.useMemo(() => {
    if (count === 0) return 0

    let index = subcategories.findIndex((child) => child.isActive)
    if (index === -1 && activeSlug) {
      index = subcategories.findIndex((child) => activeSlug.endsWith(child.slug))
    }

    return Math.max(0, index)
  }, [subcategories, activeSlug, count])

  if (count < 2) return null

  const config = getCarouselConfig(count)
  const isCarousel = count > 2

  return (
    <div className='bg-white/10 backdrop-blur-sm my-4 border-t border-white/20'>
      <div className='max-w-screen-2xl mx-auto'>
        {isCarousel ? (
          <Carousel
            opts={{
              align: 'start',
              loop: false,
              startIndex: activeIndex > 0 ? Math.max(0, activeIndex - 1) : 0,
            }}
            className='w-full'
          >
            <CarouselContent className={config.wrapper}>
              <SubcategoryList
                subcategories={subcategories}
                activeSlug={activeSlug}
                itemClassName={config.base}
                isCarousel
              />
            </CarouselContent>
            <CarouselPrevious className='disabled:hidden sm:flex left-6 bg-gray-50 border-white/30 text-gray-800 hover:bg-gray-200' />
            <CarouselNext className='disabled:hidden sm:flex right-6 bg-gray-50 border-white/30 text-gray-800 hover:bg-gray-200' />
          </Carousel>
        ) : (
          <div className={config.wrapper}>
            <SubcategoryList
              subcategories={subcategories}
              activeSlug={activeSlug}
              itemClassName={config.base}
            />
          </div>
        )}
      </div>
    </div>
  )
}
