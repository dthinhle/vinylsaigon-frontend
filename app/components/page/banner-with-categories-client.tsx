'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { sortCategoriesByTitle } from '@/lib/utils/sort-categories'
import * as React from 'react'

import { BannerCategoryCard } from './banner-category-card'

interface CategoryItem {
  id: number
  title: string
  slug: string
  thumbnail?: {
    url: string
  } | null
}

interface BannerWithCategoriesClientProps {
  categories: CategoryItem[]
  activeCategory?: { slug: string }
  baseUrl: string
}

const getCarouselConfig = (count: number) => {
  switch (count) {
    case 2:
      return {
        wrapper: 'pt-2 px-4 flex flex-row gap-4',
        base: 'basis-1/2 [&_.category-card]:lg:aspect-2/1 [&_.category-card]:aspect-square',
      }
    case 3:
      return {
        wrapper: 'pt-2 px-4 flex flex-row',
        base: 'basis-1/2 lg:basis-1/3 xl:basis-1/4',
      }
    default:
      return {
        wrapper: 'pt-2',
        base: 'lg:first:ml-8 lg:last:mr-8 first:ml-4 last:mr-4 basis-2/5 lg:basis-2/7 xl:basis-3/13',
      }
  }
}

const CategoryList = ({
  categories,
  activeCategory,
  baseUrl,
  itemClassName,
  isCarousel = false,
}: {
  categories: CategoryItem[]
  activeCategory?: { slug: string }
  baseUrl: string
  itemClassName: string
  isCarousel?: boolean
}) => {
  return (
    <>
      {categories.map((category) => {
        const isActive = activeCategory ? activeCategory.slug === category.slug : false
        const content = (
          <BannerCategoryCard
            category={category}
            link={`${baseUrl}/${category.slug}`}
            isActive={isActive}
          />
        )

        return isCarousel ? (
          <CarouselItem key={category.id} className={itemClassName}>
            {content}
          </CarouselItem>
        ) : (
          <div key={category.id} className={itemClassName}>
            {content}
          </div>
        )
      })}
    </>
  )
}

export const BannerWithCategoriesClient: React.FC<BannerWithCategoriesClientProps> = ({
  categories,
  activeCategory,
  baseUrl,
}) => {
  const sortedCategories = React.useMemo(() => sortCategoriesByTitle(categories), [categories])

  const activeIndex = React.useMemo(() => {
    if (!sortedCategories || !activeCategory) return 0
    const index = sortedCategories.findIndex((child) => activeCategory.slug === child.slug)
    return Math.max(0, index)
  }, [sortedCategories, activeCategory])

  const count = sortedCategories.length
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
              <CategoryList
                categories={sortedCategories}
                activeCategory={activeCategory}
                baseUrl={baseUrl}
                itemClassName={config.base}
                isCarousel
              />
            </CarouselContent>
            <CarouselPrevious className='disabled:hidden sm:flex left-6 bg-gray-50 border-white/30 text-gray-800 hover:bg-gray-200' />
            <CarouselNext className='disabled:hidden sm:flex right-6 bg-gray-50 border-white/30 text-gray-800 hover:bg-gray-200' />
          </Carousel>
        ) : (
          <div className={config.wrapper}>
            <CategoryList
              categories={sortedCategories}
              activeCategory={activeCategory}
              baseUrl={baseUrl}
              itemClassName={config.base}
            />
          </div>
        )}
      </div>
    </div>
  )
}
